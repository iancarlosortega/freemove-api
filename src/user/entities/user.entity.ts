import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    index: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  role: string;

  @Prop({
    required: true,
  })
  provider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
