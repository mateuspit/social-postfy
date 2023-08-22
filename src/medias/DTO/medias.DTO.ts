import { IsString, isString } from "class-validator";

export class MediaDTO {
    @IsString({
        message: "Preencha um title sendo uma string"
    })
    title: string;

    @IsString({
        message: "Preencha um username sendo uma string"
    })
    username: string;
}