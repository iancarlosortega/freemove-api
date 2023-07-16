import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findAll() {
    return this.userModel.find().select('-password').lean();
  }

  async findOne(term: string) {
    let user: IUser;

    // MongoId
    if (isValidObjectId(term)) {
      user = await this.userModel.findById(term).lean();
    }

    // Name
    if (!user) {
      user = await this.userModel
        .findOne(
          {
            email: term.toLowerCase().trim(),
          },
          {
            password: 0,
            __v: 0,
          },
        )
        .lean();
    }

    if (!user)
      throw new NotFoundException(
        `No se encontró un usuario con el id o email: ${term}`,
      );

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate(
          {
            _id: id,
          },
          {
            $set: updateUserDto,
          },
          {
            new: true,
          },
        )
        .select('-password -__v')
        .lean();
      return updatedUser;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
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
