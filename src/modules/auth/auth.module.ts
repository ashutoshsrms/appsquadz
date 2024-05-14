// src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { JwtStrategy } from '../../strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule, // Import ConfigModule here
    JwtModule.registerAsync({
      imports: [ConfigModule], // Include ConfigModule in the imports array
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
