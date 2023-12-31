import { HttpException, HttpStatus } from "@nestjs/common";

export class ServerInputPublicationException extends HttpException {
    constructor() {
        const message = `Erro no servidor ao inserir os dados de publications`;
        super(message, HttpStatus.BAD_REQUEST);
    }
}

export class InputFilterPublicationException extends HttpException {
    constructor() {
        const message = `Filtro(s) em formato(s) incorreto(s)!`;
        super(message, HttpStatus.BAD_REQUEST);
    }
}

export class NotFoundPublicationException extends HttpException {
    constructor(id: number) {
        const message = `Publicação ${id} não encontrada!`;
        super(message, HttpStatus.NOT_FOUND);
    }
}

export class ForbiddenPublicationException extends HttpException {
    constructor(id: number) {
        const message = `Publicação ${id} já publicada!`;
        super(message, HttpStatus.FORBIDDEN);
    }
}

export class ForbiddenDatePublicationException extends HttpException {
    constructor(date: Date) {
        const message = `${date} já passou!`;
        super(message, HttpStatus.FORBIDDEN);
    }
}