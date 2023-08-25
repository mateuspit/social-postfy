import { HttpException, HttpStatus } from "@nestjs/common";

export class ConflictMediaException extends HttpException {
    constructor(title?: string, username?: string) {
        let message = `Já consta no banco de dados: title: ${title}, username: ${username}`;
        super(message, HttpStatus.CONFLICT)
    }
}

export class ServerMediaException extends HttpException {
    constructor() {
        let message = `Erro no servidor ao inserir os dados de media`
        super(message, HttpStatus.BAD_REQUEST)
    }
}

export class NotFoundMediaIException extends HttpException {
    constructor(id: number) {
        let message = `Media ${id} não encontrado`
        super(message, HttpStatus.NOT_FOUND)
    }
}