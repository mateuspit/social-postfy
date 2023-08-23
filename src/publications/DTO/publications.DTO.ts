import { IsDate, IsNotEmpty, IsNumber, IsSemVer, IsString, Min } from "class-validator";

export class PublicationDTO {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    mediaId: number;
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    postId: number;
    @IsNotEmpty()
    @IsString()
    date: Date;
}