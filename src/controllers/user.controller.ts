import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put, // Import Put decorator for handling update requests
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body() body: { name: string; mobile: string; password: string },
  ) {
    const { name, mobile, password } = body;

    try {
      const existingUser = await this.userService.findOneByMobile(mobile);
      if (existingUser) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'User with this mobile number already exists',
        };
      }

      const newUser = await this.userService.createUser(name, mobile, password);

      return {
        message: 'User registered successfully',
        id: newUser._id,
        name: newUser.name,
        status: newUser.status,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
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
  // @UseGuards(JwtAuthGuard)
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
  // @UseGuards(JwtAuthGuard)
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

  // Method for updating a user
  @Put(':id')
  @UseGuards(JwtAuthGuard) // Protect updateUser endpoint with JwtAuthGuard
  async updateUser(@Param('id') id: string, @Body() body: { name?: string }) {
    try {
      const existingUser = await this.userService.getUserById(id);
      if (!existingUser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }

      if (!body.name) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Name field is required',
        };
      }

      existingUser.name = body.name;

      await existingUser.save();

      return {
        statusCode: HttpStatus.OK,
        message: 'User name updated successfully',
        id: existingUser._id,
        name: existingUser.name,
        mobile: existingUser.mobile,
        status: existingUser.status,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }
}
