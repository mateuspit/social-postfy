import { ApplicationError } from "src/protocols";

export function conflictError(): ApplicationError {
    return {
        name: "conflictError",
        message: "Data already created!",
    };
}