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
  @UsePipes(new ValidationPipe()) // Enable validation pipe for input validation
  async login(@Body() body: { mobile: string; password: string }) {
    try {
      // Validate user input
      const user = await this.authService.validateUser(
        body.mobile,
        body.password,
      );

      // Generate JWT token upon successful login
      const token = await this.authService.generateToken(user);

      // Mask the mobile number
      const maskedMobile = body.mobile.replace(/.(?=.{4})/g, '*');

      // Return user details and token
      return {
        id: user._id,
        name: user.name,
        mobile: maskedMobile,
        status: user.status,
        token: token, // Include token in the response
      };
    } catch (error) {
      throw error; // Throw the original error to propagate the error message
    }
  }
}
