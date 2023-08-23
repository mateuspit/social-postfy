import { ApplicationError } from "src/protocols";

export function inputPostError(key: string): ApplicationError {
    return {
        name: "conflictPostError",
        message: `${key} in body is not allow!`,
    };
}

export function notFoundPostError(): ApplicationError {
    return {
        name: "notFoundPostError",
        message: `post data not foundI!`,
    };
}