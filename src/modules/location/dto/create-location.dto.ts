import {
    IsString,
    IsNumber,
    IsEnum,
    IsBoolean,
    IsOptional,
    Min,
    MinLength,
    MaxLength,
    IsInt,
} from 'class-validator';
import { LocationType } from '../enums/location-type.enum';
import { Type } from 'class-transformer';

export class CreateLocationDto {
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price!: number;

    @IsEnum(LocationType, { 
        message: `Type must be one of: ${Object.values(LocationType).join(', ')}` 
    })
    type!: LocationType;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @IsInt()
    @Type(() => Number)
    renterId!: number;
}