import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './../user/entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dtos';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase().trim();
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    try {
      const user = await this.userModel.create(createUserDto);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Credenciales inválidas');
    }

    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBExceptions(error: any): never {
    this.logger.error(error);
    console.log(error);
    if (error.code === 11000) {
      throw new BadRequestException(
        'Ya existe un usuario con el email ingresado',
      );
    }
    throw new InternalServerErrorException(
      'Error inesperado, revisar logs del servidor',
    );
  }
}
