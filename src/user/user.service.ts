import {
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
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  findAll() {
    return `This action returns all user`;
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  private handleDBExceptions(error: any): never {
    this.logger.error(error);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
