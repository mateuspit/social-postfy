import { ApplicationError } from "src/protocols";

export function notFoundPublicationError(): ApplicationError {
    return {
        name: "notFoundPublicationError",
        message: `Publication data not found!`,
    };
}

export function forbiddenPublicationError(): ApplicationError {
    return {
        name: "forbiddenPublicationError",
        message: `Publication already posted!`,
    };
}

export function notFoundMediaInPublicationError(): ApplicationError {
    return {
        name: "notFoundMediaInPublicationError",
        message: `Media not found !`,
    };
}

export function notFoundPostInPublicationError(): ApplicationError {
    return {
        name: "notFoundPostInPublicationError",
        message: `Post not found !`,
    };
}

export function dateInvalidPublicationError(): ApplicationError {
    return {
        name: "dateInvalidPublicationError",
        message: `Invalid date!`,
    };
}