import { IsNotEmpty, IsString, isString } from "class-validator";

export class MediaDTO {
    @IsString({
        message: "Preencha um title sendo uma string"
    })
    @IsNotEmpty()
    title: string;

    @IsString({
        message: "Preencha um username sendo uma string"
    })
    @IsNotEmpty()
    username: string;
}