import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate as uuidValidate } from 'uuid';
import { plainToClass } from 'class-transformer';
import { User } from './entities/user.entity';
import { DbService } from 'src/db/db.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async findAll() {
    const users = await this.dbService.user.findMany();
    return users.map((user) => plainToClass(User, user));
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }

    const user = await this.dbService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.dbService.user.create({
      data: {
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password),
      },
    });

    return plainToClass(User, newUser);
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOne(id);
    if (user) {
      const isPasswordEqual = await this.isPasswordMatch(
        updatePasswordDto.oldPassword,
        user.password,
      );

      if (isPasswordEqual) {
        const updatedUser = this.dbService.user.update({
          where: { id },
          data: {
            password: await this.hashPassword(updatePasswordDto.newPassword),
            version: user.version + 1,
          },
        });

        return plainToClass(User, updatedUser);
      }
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (user) {
      await this.dbService.user.delete({
        where: { id },
      });
    }
  }

  private async hashPassword(password: string) {
    const salt = Number(process.env.CRYPT_SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private async isPasswordMatch(password: string, passwordFromDb: string) {
    const isPasswordEqual = await bcrypt.compare(password, passwordFromDb);
    if (!isPasswordEqual) {
      throw new ForbiddenException('Old password is incorrect');
    }
    return isPasswordEqual;
  }
}
