import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  accessTokenConfig,
  refreshTokenConfig,
} from './tokens-config/tokens-config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.dbService.user.findUnique({
      where: { login: createUserDto.login },
    });
    if (user) {
      throw new BadRequestException('User with this login already exists');
    }
    return await this.createNewUSer(createUserDto);
  }

  private async createNewUSer(createUserDto: CreateUserDto) {
    const newUser = await this.dbService.user.create({
      data: {
        ...createUserDto,
        password: await this.usersService.hashPassword(createUserDto.password),
      },
    });

    return plainToClass(User, newUser);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.isUserExist(loginUserDto.login);
    await this.isPasswordMatch(loginUserDto.password, user.password);

    return await this.generateToken(plainToClass(User, user));
  }

  private async generateToken(userDto: User) {
    const tokenPayload = { userId: userDto.id, login: userDto.login };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, accessTokenConfig),
      this.jwtService.signAsync(tokenPayload, refreshTokenConfig),
      ,
    ]);
    return { accessToken, refreshToken, id: userDto.id };
  }

  private async isUserExist(login: string) {
    const user = this.dbService.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new ForbiddenException('User with this login does not exist');
    }

    return user;
  }

  private async isPasswordMatch(password: string, passwordFromDb: string) {
    const isPasswordEqual = await bcrypt.compare(password, passwordFromDb);
    if (!isPasswordEqual) {
      throw new ForbiddenException('Password is incorrect');
    }
    return isPasswordEqual;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Old refresh token should be provided');
    }

    try {
      const { userId } = await this.jwtService.verifyAsync(
        refreshToken,
        refreshTokenConfig,
      );
      const user = await this.dbService.user.findUnique({
        where: { id: userId },
      });
      return await this.generateToken(plainToClass(User, user));
    } catch (err) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }
}
