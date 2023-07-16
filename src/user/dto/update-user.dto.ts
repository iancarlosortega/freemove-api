import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ValidProviders, ValidRoles } from '../interfaces';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  fullName?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(ValidRoles)
  role?: ValidRoles;

  @IsOptional()
  @IsEnum(ValidProviders)
  provider?: ValidProviders;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  age?: number;

  @IsOptional()
  @IsString()
  @Matches(/^(0|[0-9]\d*)(\.\d+)?$/, {
    message: 'Debe ser un número de teléfono válido',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Masculino', 'Femenino', 'Otro'])
  gender?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0|[0-9]\d*)(\.\d+)?$/, {
    message: 'Debe ser un número de teléfono válido',
  })
  identificationCard?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  weight?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  height?: number;
}
