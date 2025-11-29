import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RenterService } from '../service/renter.service';
import { CreateRenterDto } from '../dto/create-renter.dto';
import { UpdateRenterDto } from '../dto/update-renter.dto';
import { Renter } from '../entity/renter.entity';

@Controller('renters')
export class RenterController {
  constructor(private readonly renterService: RenterService) {}

  @Get()
  async findAll(): Promise<Renter[]> {
    return this.renterService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Renter | null> {
    return this.renterService.findById(id);
  }

  @Post()
  async create(@Body() createRenterDto: CreateRenterDto): Promise<Renter> {
    return this.renterService.create(createRenterDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRenterDto: UpdateRenterDto,
  ): Promise<Renter | null> {
    const result = await this.renterService.update(id, updateRenterDto);
    return result;
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.renterService.delete(id);
    return { message: 'Renter deleted successfully' };
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string): Promise<Renter[]> {
    return this.renterService.findByType(type);
  }
}
