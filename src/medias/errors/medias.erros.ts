import { ApplicationError } from "src/protocols";

export function conflictMediaError(): ApplicationError {
    return {
        name: "conflictError",
        message: "Media data already created!",
    };
}

export function notFoundMediaIError(): ApplicationError {
    return {
        name: "notFoundError",
        message: "Media data not found!",
    };
}