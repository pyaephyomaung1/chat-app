import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingEmail = await this.userService.findEmail(createUserDto.email);
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }
    const existingUsername = await this.userService.findUsername(
      createUserDto.username,
    );
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }
    const hasedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      password: hasedPassword,
    });
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken: token,
      user,
    };
  }
}
