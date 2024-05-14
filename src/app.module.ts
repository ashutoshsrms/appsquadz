// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseService } from './services/database.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Import ConfigModule for environment variables
    DatabaseModule,
    AuthModule,
    UserModule,
    JwtModule.registerAsync({
      // Configure JWT module asynchronously
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(process.env.JWT_SECRET), // Get JWT secret key from environment variables
        signOptions: { expiresIn: '1h' }, // Set expiration time for tokens
      }),
      inject: [ConfigService], // Inject ConfigService to access environment variables
    }),
  ],
  providers: [DatabaseService],
})
export class AppModule {}
