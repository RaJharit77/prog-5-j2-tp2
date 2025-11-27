import {
    IsString,
    IsNumber,
    IsEnum,
    IsBoolean,
    IsOptional,
    Min,
} from 'class-validator';
import { LocationType } from '../enums/location-type.enum';

export class CreateLocationDto {
    @IsString()
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsEnum(LocationType)
    type!: LocationType;

    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean;

    @IsNumber()
    renterId!: number;
}