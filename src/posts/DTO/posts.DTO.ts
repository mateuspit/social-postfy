import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class PostDTO {
    @IsNumber()
    @IsOptional()
    id: number;

    @IsString({ message: "Preencha o title, deve ser uma string" })
    @IsNotEmpty({ message: "Preencha o title, obrigatorio" })
    title: string;

    @IsString({ message: "text deve ser uma string" })
    @IsNotEmpty({ message: "Preencha o text, obrigatorio" })
    text: string;

    @IsUrl()
    @IsOptional()
    image?: string;
}
