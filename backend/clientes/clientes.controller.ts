
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';

@Controller('clientes')
export class ClientesController {
  constructor(
    @InjectRepository(Cliente)
    private repo: Repository<Cliente>,
  ) {}

  @Get()
  findAll() {
    return this.repo.find();
  }

  @Post()
  create(@Body() data: Partial<Cliente>) {
    const cliente = this.repo.create(data);
    return this.repo.save(cliente);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Cliente>) {
    return this.repo.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repo.delete(id);
  }
}
