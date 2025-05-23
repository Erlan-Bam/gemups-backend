import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailService } from 'src/shared/services/email.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async addGuest() {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {},
      });

      await tx.cart.create({
        data: {
          user_id: user.id,
        },
      });

      return user;
    });
    return result;
  }
  async register(data: RegisterDto) {
    let user = await this.userService.findByEmail(data.email);
    if (user) {
      throw new HttpException('User with such credentials already exists', 400);
    }

    user = await this.userService.createUser(data);

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async login(data: LoginDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const isMatch = await this.userService.validatePassword(
      data.password,
      user.password,
    );
    if (!isMatch) {
      throw new HttpException('Invalid password', 400);
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return {
      userId: user.id,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async changePassword(data: ChangePasswordDto) {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const token = await this.generateAccessToken(user);
    const resetLink = `https://don-vip.com/reset-password?token=${token}`;

    await this.emailService.sendChangePasswordEmail(resetLink, data.lang);

    return { message: 'Form sent successfully' };
  }
  async generateAccessToken(user: User): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        is_banned: user.is_banned,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1d',
      },
    );
  }
  async generateRefreshToken(user: User): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        is_banned: user.is_banned,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new HttpException('Invalid refresh token', 401);
      }
      return this.generateAccessToken(user);
    } catch (error) {
      throw new HttpException('Invalid refresh token', 401);
    }
  }
}
