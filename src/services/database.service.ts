// src/services/database.service.ts

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async connect(): Promise<void> {
    try {
      await this.connection;
      console.log('Connected to MongoDB Atlas successfully');
    } catch (error) {
      console.error('Failed to connect to MongoDB Atlas:', error);
    }
  }
}
