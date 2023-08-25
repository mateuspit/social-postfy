import { HttpException, HttpStatus } from "@nestjs/common";

export class ServerInputPostException extends HttpException {
    constructor() {
        const message = `Erro no servidor ao inserir os dados de post`
        super(message, HttpStatus.BAD_REQUEST)
    }
}

export class NotFoundPostError extends HttpException {
    constructor(id: number) {
        const message = `Post ${id} não encontrado!`
        super(message, HttpStatus.NOT_FOUND)
    }
}

export class ForbiddenPostException extends HttpException {
    constructor(mediaId: number, publicationId: number) {
        const message = `Post ${mediaId} não pode ser deletado pois está na publication ${publicationId}!`
        super(message, HttpStatus.FORBIDDEN)
    }
}