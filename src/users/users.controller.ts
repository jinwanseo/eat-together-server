import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReadUsersInput, ReadUsersOutput } from './dtos/read-users.dto';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { ReadUserOutput } from './dtos/read-user.dto';
import { User } from './entities/user.entity';
import { LoginUserInput, LoginUserOutput } from './dtos/login-user.dto';
import { Role } from '../auth/role.decorator';
import AuthUser from '../auth/auth.decorator';
import { RemoveUserOutput } from './dtos/remove-user.dto';
import { UpdateUserInput, UpdateUserOutput } from './dtos/update-user.dto';
import {
  CheckPasswordInput,
  CheckPasswordOutput,
} from './dtos/check-password.dto';

@ApiTags('회원 정보')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Role(['Client'])
  @Post('password')
  @ApiOperation({ summary: '비밀번호 체크', description: '비밀번호 조회 API' })
  checkUserPw(
    @AuthUser() user: User,
    @Body() checkPasswordInput: CheckPasswordInput,
  ): Promise<CheckPasswordOutput> {
    return this.userService.checkUserPw(user, checkPasswordInput);
  }

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

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '로그인 API' })
  loginUser(@Body() loginUserInput: LoginUserInput): Promise<LoginUserOutput> {
    return this.userService.loginUser(loginUserInput);
  }

  @Role(['Client'])
  @Get('me')
  @ApiOperation({ summary: '내 정보 조회', description: '내 정보 조회 API' })
  async me(@AuthUser() user: User): Promise<ReadUserOutput> {
    return {
      ok: true,
      result: user,
    };
  }

  @Role(['Client'])
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

  @Role(['Client'])
  @Delete('delete')
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 탈퇴 API (자신의 아이디만 가능)',
  })
  async removeUser(@AuthUser() user: User): Promise<RemoveUserOutput> {
    return this.userService.removeUser(user);
  }

  @Role(['Client'])
  @Patch('update')
  @ApiOperation({
    summary: '회원 수정',
    description: '회원 수정 API (자신의 아이디만 가능)',
  })
  async editUser(
    @AuthUser() user: User,
    @Body() updateUserInput: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    console.log(updateUserInput);
    return this.userService.updateUser(user, updateUserInput);
  }
}
