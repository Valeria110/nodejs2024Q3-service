import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { IUser } from 'src/types/types';
import { validate as uuidValidate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private usersMap: Map<string, IUser> = new Map();

  findAll(): User[] {
    return [...this.usersMap.values()].map((user) => plainToClass(User, user));
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }

    const user = this.usersMap.get(id);
    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }

    return plainToClass(User, user);
  }

  create(createUserDto: CreateUserDto): User {
    const { login, password } = createUserDto;
    const date = new Date().getTime();
    const newUser: IUser = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: date,
      updatedAt: date,
    };
    this.usersMap.set(newUser.id, newUser);

    return plainToClass(User, newUser);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): User {
    const user = this.findOne(id);
    if (user) {
      const userStoredPassword = this.usersMap.get(id).password;

      if (updatePasswordDto.oldPassword !== userStoredPassword) {
        throw new ForbiddenException('Wrong old password');
      }

      const userUpdatedData: IUser = {
        ...user,
        updatedAt: new Date().getTime(),
        password: updatePasswordDto.newPassword,
        version: user.version + 1,
      };
      this.usersMap.set(id, userUpdatedData);

      return plainToClass(User, userUpdatedData);
    }
  }

  remove(id: string): User {
    const user = this.findOne(id);
    if (user) {
      this.usersMap.delete(id);
      return user;
    }
  }
}
