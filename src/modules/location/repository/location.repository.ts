import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entity/location.entity';
import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';

@Injectable()
export class LocationRepository implements IBaseRepository<Location> {
  constructor(
    @InjectRepository(Location)
    private readonly repository: Repository<Location>,
  ) {}

  async findAll(): Promise<Location[]> {
    return this.repository.find({ relations: ['renter'] });
  }

  async findById(id: number): Promise<Location | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['renter'],
    });
  }

  async create(location: Partial<Location>): Promise<Location> {
    const newLocation = this.repository.create(location);
    return this.repository.save(newLocation);
  }

  async update(
    id: number,
    location: Partial<Location>,
  ): Promise<Location | null> {
    await this.repository.update(id, location);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findByRenter(renterId: number): Promise<Location[]> {
    return this.repository.find({
      where: { renterId },
      relations: ['renter'],
    });
  }

  async findByType(type: Location['type']): Promise<Location[]> {
    return this.repository.find({
      where: { type },
      relations: ['renter'],
    });
  }
}
