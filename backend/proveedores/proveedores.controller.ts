
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../entities/proveedor.entity';

@Controller('proveedores')
export class ProveedoresController {
  constructor(
    @InjectRepository(Proveedor)
    private repo: Repository<Proveedor>,
  ) {}

  @Get()
  findAll() {
    return this.repo.find();
  }

  @Post()
  create(@Body() data: Partial<Proveedor>) {
    const item = this.repo.create(data);
    return this.repo.save(item);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Proveedor>) {
    return this.repo.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repo.delete(id);
  }
}
