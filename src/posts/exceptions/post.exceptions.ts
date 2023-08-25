import { HttpException, HttpStatus } from "@nestjs/common";

export class ServerInputPostException extends HttpException {
    constructor() {
        const message = `Erro no servidor ao inserir os dados de post`
        super(message, HttpStatus.BAD_REQUEST)
    }
}