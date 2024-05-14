// src/modules/user/user.module.ts

import { Module } from '@nestjs/common';
import { UserController } from '../../controllers/user.controller';
import { UserService } from '../../services/user.service';
import { UserDatabaseService } from '../../services/user-database.service'; // Import UserDatabaseService
import { User, UserSchema } from '../../entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserDatabaseService],
  exports: [UserService],
})
export class UserModule {}
