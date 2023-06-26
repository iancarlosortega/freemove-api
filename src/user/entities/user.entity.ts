import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUserProvider, IUserRole } from '../interfaces';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  fullName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    default: 'USER',
    enum: {
      values: ['ADMIN', 'USER'],
      message: '{VALUE} no es rol válido',
    },
  })
  role: IUserRole;

  @Prop({
    type: String,
    required: true,
    default: 'email-password',
    enum: {
      values: ['email-password', 'google', 'facebook'],
      message: '{VALUE} no es un proveedor válido',
    },
  })
  provider: IUserProvider;

  @Prop({
    type: Number,
    min: 0,
  })
  age?: number;

  @Prop()
  phone?: string;

  @Prop({
    type: String,
    enum: {
      values: ['Masculino', 'Femenino', 'Otro'],
      message: '{VALUE} no es un género válido',
    },
  })
  gender?: string;

  @Prop()
  identificationCard?: string;

  @Prop()
  country?: string;

  @Prop()
  city?: string;

  @Prop({
    type: Number,
    min: 0,
  })
  weight?: number;

  @Prop({
    type: Number,
    min: 0,
  })
  height?: number;

  // TODO: Redes Sociales e imágenes
  // followers?: DocumentReference[];
  // following?: DocumentReference[];
  // likes?: DocumentReference[];
  // photoUrl?: string;
  // photoFilename?: string;
  // bannerUrl?: string;
  // bannerFilename?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
