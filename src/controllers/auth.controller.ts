import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe()) 
  async login(@Body() body: { mobile: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        body.mobile,
        body.password,
      );

      const token = await this.authService.generateToken(user);
      const maskedMobile = body.mobile.replace(/.(?=.{4})/g, '*');

      return {
        id: user._id,
        name: user.name,
        mobile: maskedMobile,
        status: user.status,
        token: token,
      };
    } catch (error) {
      throw error; 
    }
  }
}
