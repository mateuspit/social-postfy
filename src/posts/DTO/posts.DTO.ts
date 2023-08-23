import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class PostDTO {
    @IsString({ message: "Preencha o title, deve ser uma string" })
    @IsNotEmpty({ message: "Preencha o title, obrigatorio" })
    title: string;

    @IsString({ message: "text deve ser uma string" })
    @IsNotEmpty({ message: "Preencha o text, obrigatorio" })
    text: string;

    @IsUrl()
    @IsOptional()
    image: string;
}
