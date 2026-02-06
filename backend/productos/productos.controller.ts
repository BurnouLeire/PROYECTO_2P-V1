import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';

@Controller('productos')
export class ProductosController {
  constructor(
    @InjectRepository(Producto)
    private repo: Repository<Producto>,
  ) {}

  @Get()
  findAll() {
    // SIN cargar relaciones por ahora
    return this.repo.find();
  }

  @Post()
  create(@Body() data: Partial<Producto>) {
    const item = this.repo.create(data);
    return this.repo.save(item);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Producto>) {
    return this.repo.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repo.delete(id);
  }
}