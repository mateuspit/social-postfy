import { IsString, isString } from "class-validator";

export class MediaDTO {
    id: number;
    @IsString({
        message: "Preencha um title sendo uma string"
    })
    title: string;

    @IsString({
        message: "Preencha um username sendo uma string"
    })
    username: string;
}