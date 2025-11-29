import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { RenterService } from './renter.service';
import { RenterRepository } from '../repositories/renter.repository';
import { CreateRenterDto } from '../dto/create-renter.dto';
import { UpdateRenterDto } from '../dto/update-renter.dto';
import { Renter } from '../entities/renter.entity';
import { RenterType } from '../enums/renter-type.enum';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';

describe('RenterService', () => {
    let service: RenterService;
    let repository: RenterRepository;

    const mockRenterRepository = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findByEmail: jest.fn(),
        findByType: jest.fn(),
    };

    const mockRenter: Renter = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        type: RenterType.INDIVIDUAL,
        address: '123 Main St',
        locations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RenterService,
                {
                    provide: RenterRepository,
                    useValue: mockRenterRepository,
                },
            ],
        }).compile();

        service = module.get<RenterService>(RenterService);
        repository = module.get<RenterRepository>(RenterRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return an array of renters', async () => {
            const renters = [mockRenter];
            mockRenterRepository.findAll.mockResolvedValue(renters);

            const result = await service.findAll();
            expect(result).toEqual(renters);
            expect(mockRenterRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a renter when found', async () => {
            mockRenterRepository.findById.mockResolvedValue(mockRenter);

            const result = await service.findById(1);
            expect(result).toEqual(mockRenter);
            expect(mockRenterRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should throw EntityNotFoundException when renter not found', async () => {
            mockRenterRepository.findById.mockResolvedValue(null);

            await expect(service.findById(1)).rejects.toThrow(EntityNotFoundException);
        });
    });

    describe('create', () => {
        const createRenterDto: CreateRenterDto = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            type: RenterType.INDIVIDUAL,
            address: '123 Main St',
        };

        it('should create a new renter', async () => {
            mockRenterRepository.findByEmail.mockResolvedValue(null);
            mockRenterRepository.create.mockResolvedValue(mockRenter);

            const result = await service.create(createRenterDto);
            expect(result).toEqual(mockRenter);
            expect(mockRenterRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
            expect(mockRenterRepository.create).toHaveBeenCalledWith(createRenterDto);
        });

        it('should throw ConflictException when email already exists', async () => {
            mockRenterRepository.findByEmail.mockResolvedValue(mockRenter);

            await expect(service.create(createRenterDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('update', () => {
        const updateRenterDto: UpdateRenterDto = {
            name: 'John Updated',
            email: 'john.updated@example.com',
        };

        it('should update a renter', async () => {
            mockRenterRepository.findById.mockResolvedValue(mockRenter);
            mockRenterRepository.findByEmail.mockResolvedValue(null);
            mockRenterRepository.update.mockResolvedValue({ ...mockRenter, ...updateRenterDto });

            const result = await service.update(1, updateRenterDto);
            expect(result.name).toBe('John Updated');
            expect(mockRenterRepository.findById).toHaveBeenCalledWith(1);
        });

        it('should throw EntityNotFoundException when renter not found', async () => {
            mockRenterRepository.findById.mockResolvedValue(null);

            await expect(service.update(1, updateRenterDto)).rejects.toThrow(EntityNotFoundException);
        });

        it('should throw ConflictException when new email already exists', async () => {
            mockRenterRepository.findById.mockResolvedValue(mockRenter);
            mockRenterRepository.findByEmail.mockResolvedValue({ ...mockRenter, id: 2 });

            await expect(service.update(1, updateRenterDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('delete', () => {
        it('should delete a renter', async () => {
            mockRenterRepository.findById.mockResolvedValue(mockRenter);
            mockRenterRepository.delete.mockResolvedValue(true);

            const result = await service.delete(1);
            expect(result).toBe(true);
            expect(mockRenterRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw EntityNotFoundException when renter not found', async () => {
            mockRenterRepository.findById.mockResolvedValue(null);

            await expect(service.delete(1)).rejects.toThrow(EntityNotFoundException);
        });
    });

    describe('findByType', () => {
        it('should return renters by type', async () => {
            const renters = [mockRenter];
            mockRenterRepository.findByType.mockResolvedValue(renters);

            const result = await service.findByType('individual');
            expect(result).toEqual(renters);
            expect(mockRenterRepository.findByType).toHaveBeenCalledWith('individual');
        });
    });
});