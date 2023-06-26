import { BadRequestException } from '@nestjs/common/exceptions';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './../user/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { OAuthLoginUserDto } from './dto/oauth-login-user-dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLowerCase();
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    try {
      const user = await this.userModel.create(createUserDto);
      const { _id, email, fullName, role, provider } = user;
      return {
        _id,
        email,
        fullName,
        role,
        provider,
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

    const { role, fullName, _id, provider } = user;

    return {
      _id,
      email: email.toLowerCase(),
      role,
      fullName,
      provider,
    };
  }

  async oAuthLogin(oauthLoginUserDto: OAuthLoginUserDto) {
    const user = await this.userModel.findOne({
      email: oauthLoginUserDto.email.toLowerCase().trim(),
    });

    if (user) {
      const { role, fullName, _id, provider } = user;

      return {
        _id,
        email: oauthLoginUserDto.email.toLowerCase(),
        role,
        fullName,
        provider,
      };
    }

    const newUser = await this.userModel.create({
      email: oauthLoginUserDto.email,
      password: '@',
      fullName: oauthLoginUserDto.fullName,
    });
    const { _id, email, fullName, role, provider } = newUser;
    return {
      _id,
      email,
      fullName,
      role,
      provider,
    };
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
