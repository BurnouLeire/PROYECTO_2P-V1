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
    const users = await this.authService.findAll();
    // Remover PASSWORD_HASH antes de retornar
    return users.map(u => {
      const { PASSWORD_HASH, ...user } = u;
      return user;
    });
  }

  @Post('users')
  async create(@Body() body: any) {
    return this.authService.create(body);
  }

  @Delete('users/:id')
  async remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Get('status')
  async getStatus() {
    const users = await this.authService.findAll();
    return {
      status: '✅ OK',
      database: 'SQLite',
      totalUsers: users.length,
      message: 'Base de datos conectada correctamente'
    };
  }
}