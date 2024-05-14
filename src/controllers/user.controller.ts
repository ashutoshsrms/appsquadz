import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Import JwtAuthGuard

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body() body: { name: string; mobile: string; password: string },
  ) {
    const { name, mobile, password } = body;

    try {
      // Validate mobile number uniqueness and constraints
      const existingUser = await this.userService.findOneByMobile(mobile);
      if (existingUser) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'User with this mobile number already exists',
        };
      }

      console.log('password', password);
      // Hash the password
      // const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // const hashedPassword=password;
      

      // Create the user
      const newUser = await this.userService.createUser(name, mobile, password);

      console.log(newUser);
      // Customize the success response
      return {
        message: 'User registered successfully',
        id: newUser._id,
        name: newUser.name,
        status: newUser.status,
      };
    } catch (error) {
      // Handle other errors
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Protect getAllUsers endpoint with JwtAuthGuard
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return users.map((user) => ({
      id: user._id,
      name: user.name,
      mobile: 'masked',
      status: user.status,
    }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // Protect getUserById endpoint with JwtAuthGuard
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }
    return {
      id: user._id,
      name: user.name,
      mobile: 'masked',
      status: user.status,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Protect deleteUser endpoint with JwtAuthGuard
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteUser(id);
    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }
}
