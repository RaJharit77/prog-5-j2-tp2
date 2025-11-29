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
import { LocationService } from '../service/location.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { Location } from '../entity/location.entity';
import { LocationType } from '../enum/location-type.enum';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async findAll(): Promise<Location[]> {
    return this.locationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    return this.locationService.findById(id);
  }

  @Post()
  async create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    return this.locationService.create(createLocationDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.locationService.delete(id);
    return { message: 'Location deleted successfully' };
  }

  @Get('renter/:renterId')
  async findByRenter(
    @Param('renterId', ParseIntPipe) renterId: number,
  ): Promise<Location[]> {
    return this.locationService.findByRenter(renterId);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: LocationType): Promise<Location[]> {
    return this.locationService.findByType(type);
  }
}
