import { UserService } from 'src/user/user.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from 'src/shared/guards/admin.guards';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth('JWT')
export class UserController {
  private readonly baseUrl: string;
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    this.baseUrl =
      nodeEnv === 'development'
        ? 'http://localhost:6001'
        : 'https://don-vip-backend-production.up.railway.app';
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  async getMe(@Request() request) {
    return this.userService.findById(request.user.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Find all users (pagination + search)' })
  @ApiResponse({ status: 200, description: 'List of users with pagination' })
  async findAllUsers(
    @Query('search') search?: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.userService.findAllUsers({
      search,
      page: page,
      limit: limit,
    });
  }

  @Patch(':id/ban')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Ban a user by ID' })
  @ApiResponse({ status: 200, description: 'User banned successfully' })
  async banUser(@Param('id') id: string) {
    return this.userService.banUser(id);
  }

  @Patch(':id/unban')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Unban a user by ID' })
  @ApiResponse({ status: 200, description: 'User unbanned successfully' })
  async unbanUser(@Param('id') id: string) {
    return this.userService.unbanUser(id);
  }

  @Post('reset-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Reset password for authenticated user' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  async resetPassword(@Body() data: ResetPasswordDto, @Request() request) {
    data.email = request.user.email;
    return this.userService.resetPassword(data);
  }

  @Patch('update-profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile data to update',
    type: UpdateProfileDto,
  })
  async updateProfile(@Body() data: UpdateProfileDto, @Request() request) {
    return this.userService.updateProfile(request.user.id, data);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of user you want to get',
    schema: {
      type: 'string',
      example: '123e4567-e89b-12d3-a456-426614174000',
    },
  })
  async getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
