import { ApplicationError } from "src/protocols";

export function inputPostError(key): ApplicationError {
    return {
        name: "conflictError",
        message: `${key} in body is not allow!`,
    };
}