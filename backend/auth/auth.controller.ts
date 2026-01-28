
import { Controller, Post, Body, Get, Delete, Param, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    return user;
  }

  @Get('users')
  async getUsers() {
    return this.authService.findAll();
  }

  @Post('users')
  async create(@Body() body: any) {
    return this.authService.create(body);
  }

  @Delete('users/:id')
  async remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Post('seed')
  async seed() {
    return this.authService.seedAdmin();
  }
}
