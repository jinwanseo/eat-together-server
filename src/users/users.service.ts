import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { ReadUsersInput, ReadUsersOutput } from './dtos/read-users.dto';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginUserInput, LoginUserOutput } from './dtos/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { RemoveUserOutput } from './dtos/remove-user.dto';
import { UpdateUserInput, UpdateUserOutput } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async getUsers({
    take,
    page,
    keyword,
  }: ReadUsersInput): Promise<ReadUsersOutput> {
    try {
      const [results, total] = await this.users.findAndCount({
        ...(keyword && {
          where: [
            { email: ILike(`%${keyword}%`) },
            { name: ILike(`%${keyword}%`) },
          ],
        }),
        take: take,
        skip: (page - 1) * take,
      });

      return {
        ok: true,
        results,
        total,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message ?? '유저 리스트 조회 중 에러 발생',
      };
    }
  }

  async createUser({
    email,
    ...others
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exist = await this.users.exist({ where: { email } });
      if (exist) throw new Error('이미 가입 처리된 아이디');

      await this.users.save(this.users.create({ email, ...others }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message ?? '회원 가입 도중 에러 발생',
      };
    }
  }

  async getById(userId: number): Promise<User> {
    return this.users.findOne({ where: { id: userId } });
  }

  async loginUser({
    email,
    password,
  }: LoginUserInput): Promise<LoginUserOutput> {
    const user: User = await this.users.findOne({
      where: {
        email,
      },
      select: ['id', 'password'],
    });
    try {
      if (!user) throw new Error('로그인 유저 정보가 없습니다.');
      const result: boolean = await user.comparePassword(password);
      if (!result) throw new Error('비밀번호를 다시 확인해주세요');
      const token = this.authService.sign({ id: user.id });

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message ?? '로그인 처리 중 에러 발생',
      };
    }
  }

  async removeUser(user: User): Promise<RemoveUserOutput> {
    try {
      await this.users.delete(user.id);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message ?? '유저 삭제 도중 에러 발생',
      };
    }
  }

  async updateUser(
    user: User,
    updateUserInput: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    try {
      await this.users.save(
        this.users.create({
          ...user,
          ...updateUserInput,
          id: user.id,
        }),
      );
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error?.message ?? '유저 업데이트 도중 에러 발생',
      };
    }
  }
}
