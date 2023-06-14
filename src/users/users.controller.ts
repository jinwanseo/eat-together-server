import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReadUsersInput, ReadUsersOutput } from './dtos/read-users.dto';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { ReadUserOutput } from './dtos/read-user.dto';
import { User } from './entities/user.entity';
import { LoginUserInput, LoginUserOutput } from './dtos/login-user.dto';
import { Role } from '../auth/role.decorator';

@ApiTags('회원 정보')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Role(['Client'])
  @Post('list')
  @ApiOperation({ summary: '회원 리스트', description: '회원 리스트 조회' })
  getUsers(@Body() readUsersInput: ReadUsersInput): Promise<ReadUsersOutput> {
    return this.userService.getUsers(readUsersInput);
  }

  @Post('create')
  @ApiOperation({ summary: '회원 가입', description: '회원 가입 API' })
  createUser(
    @Body() createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Get('profile')
  @ApiOperation({ summary: '프로필 조회', description: '프로필 조회 API' })
  async profile(@Query('userId') userId: number): Promise<ReadUserOutput> {
    try {
      const user: User = await this.userService.getById(userId);
      if (!user) throw new Error('요청하신 회원 정보가 없습니다.');
      return {
        ok: true,
        result: user,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message ?? '유저 정보 조회중 에러 발생',
      };
    }
  }

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '로그인 API' })
  loginUser(@Body() loginUserInput: LoginUserInput): Promise<LoginUserOutput> {
    return this.userService.loginUser(loginUserInput);
  }
}
