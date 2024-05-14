import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseService } from './services/database.service';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    DatabaseModule,
    AuthModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(process.env.JWT_SECRET), 
        signOptions: { expiresIn: '1h' }, 
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
})
export class AppModule {}
