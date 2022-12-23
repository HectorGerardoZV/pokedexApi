import { IsNumber, IsPositive, Min, IsOptional } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    offset: number;
}