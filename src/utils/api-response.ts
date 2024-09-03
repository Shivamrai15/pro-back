export class ApiResponse {
    
    private statusCode : number;
    private message : string
    private data : any;
    private success : boolean

    constructor ( statusCode: number, data:any, message = "Success" ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}