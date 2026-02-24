// filepath: backend/src/auth/auth.service.ts

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma';
import { MailService } from '../mail';
import { RegisterDto, LoginDto } from './dto';

// Dummy hash used for constant-time comparison when user is not found,
// preventing timing-based user enumeration attacks.
const DUMMY_HASH = '$2b$12$LJ3m4ys3Lg/GCCFy3HVfYOScMFCkBYPJBxkRKZHMCvUra7y.aWBOq';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username is already in use');
    }

    const emailVerifyToken = uuidv4();

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
        role: dto.role,
        emailVerifyToken,
      },
    });

    // Fire-and-forget email sending
    this.mail
      .sendVerificationEmail(dto.email, emailVerifyToken)
      .catch((err) => console.error('Failed to send verification email:', err));

    return { message: 'Registration successful. Please check your email.' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Constant-time comparison: always run bcrypt.compare even if user is null
    const passwordHash = user?.password ?? DUMMY_HASH;
    const isPasswordValid = await bcrypt.compare(dto.password, passwordHash);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Please verify your email before logging in',
      );
    }

    const tokens = await this._generateTokens(user.id, user.email, user.role);
    await this._storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(userId: string, incomingToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const isTokenValid = await bcrypt.compare(incomingToken, user.refreshToken);

    if (!isTokenValid) {
      // Token reuse attack detected — nullify stored token immediately
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
      throw new ForbiddenException(
        'Refresh token reuse detected. Please login again.',
      );
    }

    const tokens = await this._generateTokens(user.id, user.email, user.role);
    await this._storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (user.isEmailVerified) {
      return { message: 'Email is already verified.' };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
      },
    });

    return { message: 'Email verified successfully.' };
  }

  async resendVerificationEmail(email: string) {
    const genericMessage =
      'If that email exists and is unverified, a new link has been sent.';

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && !user.isEmailVerified) {
      const newToken = uuidv4();

      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifyToken: newToken },
      });

      // Fire-and-forget
      this.mail
        .sendVerificationEmail(email, newToken)
        .catch((err) =>
          console.error('Failed to resend verification email:', err),
        );
    }

    // Always return the same message to prevent user enumeration
    return { message: genericMessage };
  }

  private async _generateTokens(
    userId: string,
    email: string,
    role: Role,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async _storeRefreshToken(
    userId: string,
    token: string,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(token, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }
}
