// src/utils/ApiError.ts
export default class ApiError extends Error {
    public statusCode: number;
    public details?: any; // pour stocker des infos comme les champs manquants

    constructor(statusCode: number, message: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(message: string, details?: any) {
        return new ApiError(400, message, details);
    }

    static notFound(message: string) {
        return new ApiError(404, message);
    }

    // autres méthodes : internal, forbidden, etc.
    static internal(message: string): ApiError {
        return new ApiError(500, message);
    }
}