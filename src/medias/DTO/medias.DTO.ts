import { IsNotEmpty, IsString, isString } from "class-validator";

export class MediaDTO {
    @IsString({
        message: "Preencha um title sendo uma string!"
    })
    @IsNotEmpty({ message: "title é obrigatorio!" })
    title: string;

    @IsString({
        message: "Preencha um username sendo uma string!"
    })
    @IsNotEmpty({ message: "username é obrigatorio!" })
    username: string;
}