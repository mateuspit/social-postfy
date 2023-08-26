import { IsDateString, IsNotEmpty, IsNumber, IsOptional, Min, MinDate } from "class-validator";

export class PublicationDTO {
    @IsOptional()
    @IsNumber()
    id: number;
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    mediaId: number;
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    postId: number;
    @IsNotEmpty()
    @IsDateString()
    date: Date;
}