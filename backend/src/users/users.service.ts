// filepath: backend/src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

const SAFE_USER_SELECT = {
  id: true,
  email: true,
  username: true,
  role: true,
  isEmailVerified: true,
  createdAt: true,
  updatedAt: true,
  // Never select: password, refreshToken, emailVerifyToken
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: SAFE_USER_SELECT,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: SAFE_USER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }
}
