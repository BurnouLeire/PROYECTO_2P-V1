
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from '../entities/factura.entity';

@Controller('facturas')
export class FacturasController {
  constructor(
    @InjectRepository(Factura)
    private repo: Repository<Factura>,
  ) {}

  @Get()
  findAll() {
    return this.repo.find();
  }

  @Post()
  create(@Body() data: Partial<Factura>) {
    const item = this.repo.create(data);
    return this.repo.save(item);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Factura>) {
    return this.repo.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repo.delete(id);
  }
}
