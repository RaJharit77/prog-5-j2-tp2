import { Injectable } from '@nestjs/common';
import { LocationRepository } from '../repositories/location.repository';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { Location } from '../entities/location.entity';
import { BaseService } from '../../../common/abstractions/base.service';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { LocationType } from '../enums/location-type.enum';

@Injectable()
export class LocationService extends BaseService<Location> {
  constructor(private readonly locationRepository: LocationRepository) {
    super(LocationService.name);
  }

  async findAll(): Promise<Location[]> {
    this.logger.log('Fetching all locations');
    return this.locationRepository.findAll();
  }

  async findById(id: number): Promise<Location> {
    this.logger.log(`Fetching location with ID: ${id}`);
    const location = await this.locationRepository.findById(id);

    if (!location) {
      throw new EntityNotFoundException('Location', id);
    }

    return location;
  }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    this.logger.log('Creating new location');
    try {
      const location = await this.locationRepository.create(createLocationDto);
      this.logger.log(`Location created with ID: ${location.id}`);
      return location;
    } catch (error) {
      this.logger.error(
        'Failed to create location',
        error instanceof Error ? error.stack : 'Unknown error',
      );
      throw error;
    }
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    this.logger.log(`Updating location with ID: ${id}`);

    const existingLocation = await this.locationRepository.findById(id);
    if (!existingLocation) {
      throw new EntityNotFoundException('Location', id);
    }

    const result = await this.locationRepository.update(id, updateLocationDto);
    if (!result) {
      throw new EntityNotFoundException('Location', id);
    }
    return result;
  }

  async delete(id: number): Promise<boolean> {
    this.logger.log(`Deleting location with ID: ${id}`);

    const existingLocation = await this.locationRepository.findById(id);
    if (!existingLocation) {
      throw new EntityNotFoundException('Location', id);
    }

    return this.locationRepository.delete(id);
  }

  async findByRenter(renterId: number): Promise<Location[]> {
    this.logger.log(`Fetching locations for renter ID: ${renterId}`);
    return this.locationRepository.findByRenter(renterId);
  }

  async findByType(type: string): Promise<Location[]> {
    this.logger.log(`Fetching locations of type: ${type}`);
    if (!Object.values(LocationType).includes(type as LocationType)) {
      throw new Error(`Invalid location type: ${type}`);
    }
    return this.locationRepository.findByType(type as LocationType);
  }
}
