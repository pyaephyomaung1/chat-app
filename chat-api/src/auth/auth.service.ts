import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

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

  async login(loginDto: LoginDto) {
    const user = await this.userService.findEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect Password');
    }
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return {
      accessToken: token,
    };
  }
}
