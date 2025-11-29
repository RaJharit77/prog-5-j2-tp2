import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { LocationRepository } from '../repository/location.repository';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { Location } from '../entity/location.entity';
import { LocationType } from '../enum/location-type.enum';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { RenterType } from '../../renter/enum/renter-type.enum';

describe('LocationService', () => {
  let service: LocationService;

  const mockLocationRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByRenter: jest.fn(),
    findByType: jest.fn(),
  };

  const mockLocation: Location = {
    id: 1,
    name: 'Test Location',
    description: 'Test Description',
    price: 100,
    type: LocationType.CAR,
    isAvailable: true,
    renterId: 1,
    renter: {
      id: 1,
      name: 'Test Renter',
      email: 'renter@example.com',
      phone: '+1234567890',
      type: RenterType.INDIVIDUAL,
      address: '123 Test St',
      locations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: LocationRepository,
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const locations = [mockLocation];
      mockLocationRepository.findAll.mockResolvedValue(locations);

      const result = await service.findAll();
      expect(result).toEqual(locations);
      expect(mockLocationRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a location when found', async () => {
      mockLocationRepository.findById.mockResolvedValue(mockLocation);

      const result = await service.findById(1);
      expect(result).toEqual(mockLocation);
      expect(mockLocationRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw EntityNotFoundException when location not found', async () => {
      mockLocationRepository.findById.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });

  describe('create', () => {
    const createLocationDto: CreateLocationDto = {
      name: 'New Location',
      description: 'New Description',
      price: 150,
      type: LocationType.HOUSE,
      isAvailable: true,
      renterId: 1,
    };

    it('should create a new location', async () => {
      mockLocationRepository.create.mockResolvedValue(mockLocation);

      const result = await service.create(createLocationDto);
      expect(result).toEqual(mockLocation);
      expect(mockLocationRepository.create).toHaveBeenCalledWith(
        createLocationDto,
      );
    });
  });

  describe('update', () => {
    const updateLocationDto: UpdateLocationDto = {
      name: 'Updated Location',
      price: 200,
    };

    it('should update a location', async () => {
      mockLocationRepository.findById.mockResolvedValue(mockLocation);
      mockLocationRepository.update.mockResolvedValue({
        ...mockLocation,
        ...updateLocationDto,
      });

      const result = await service.update(1, updateLocationDto);
      expect(result.name).toBe('Updated Location');
      expect(mockLocationRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw EntityNotFoundException when location not found', async () => {
      mockLocationRepository.findById.mockResolvedValue(null);

      await expect(service.update(1, updateLocationDto)).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a location', async () => {
      mockLocationRepository.findById.mockResolvedValue(mockLocation);
      mockLocationRepository.delete.mockResolvedValue(true);

      const result = await service.delete(1);
      expect(result).toBe(true);
      expect(mockLocationRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw EntityNotFoundException when location not found', async () => {
      mockLocationRepository.findById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(EntityNotFoundException);
    });
  });

  describe('findByRenter', () => {
    it('should return locations by renter ID', async () => {
      const locations = [mockLocation];
      mockLocationRepository.findByRenter.mockResolvedValue(locations);

      const result = await service.findByRenter(1);
      expect(result).toEqual(locations);
      expect(mockLocationRepository.findByRenter).toHaveBeenCalledWith(1);
    });
  });

  describe('findByType', () => {
    it('should return locations by type', async () => {
      const locations = [mockLocation];
      mockLocationRepository.findByType.mockResolvedValue(locations);

      const result = await service.findByType('car');
      expect(result).toEqual(locations);
      expect(mockLocationRepository.findByType).toHaveBeenCalledWith('car');
    });
  });
});
