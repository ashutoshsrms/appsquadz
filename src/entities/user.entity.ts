import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true })
  mobile: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  status: boolean;

  @Prop({ default: null })
  last_login: Date;

  @Prop({ default: null })
  ip_address: string;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
