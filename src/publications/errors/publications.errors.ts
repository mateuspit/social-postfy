import { ApplicationError } from "src/protocols";

export function notFoundPublicationError(): ApplicationError {
    return {
        name: "notFoundPublicationError",
        message: `Publication data not found!`,
    };
}