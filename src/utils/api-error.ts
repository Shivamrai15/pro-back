export class ApiError extends Error {
    public statusCode : number;
    public message: string;
    public data : string|null;
    public errors : string[];
    public success : boolean;

    constructor (
        statusCode: number,
        message = "Something went wrong",
        errors = [],
        stack = "",
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = false;
        this.message = message;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}