import { HttpException, HttpStatus } from "@nestjs/common";

export class ServerInputPublicationException extends HttpException {
    constructor() {
        const message = `Erro no servidor ao inserir os dados de publications`;
        super(message, HttpStatus.BAD_REQUEST);
    }
}