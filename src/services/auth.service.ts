import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(mobile: string, password: string): Promise<User> {
    const user = await this.userService.findOneByMobile(mobile);
    console.log('User from database:', user);
    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

  
    const isBcryptHashed = user.password.startsWith('$2b$');

    let isPasswordValid: boolean;
    if (isBcryptHashed) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); 
      isPasswordValid = await bcrypt.compare(password, hashedPassword);
    }

    console.log('Password hash from database:', user.password);
    console.log('Password comparison result:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Password mismatch');
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async generateToken(user: User): Promise<string> {
    const payload = { mobile: user.mobile, sub: user._id };
    return this.jwtService.signAsync(payload);
  }
}
