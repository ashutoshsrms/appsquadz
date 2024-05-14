import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserDatabaseService } from './user-database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userDatabaseService: UserDatabaseService) {}

  async findOneByMobile(mobile: string): Promise<User | null> {
    return this.userDatabaseService.findOneByMobile(mobile);
  }

  async createUser(
    name: string,
    mobile: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); 

    return this.userDatabaseService.createUser(name, mobile, hashedPassword);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userDatabaseService.getAllUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userDatabaseService.getUserById(id);
  }

  async updateUser(user: User): Promise<User> {
    return this.userDatabaseService.updateUser(user);
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.userDatabaseService.deleteUser(id);
  }
}
