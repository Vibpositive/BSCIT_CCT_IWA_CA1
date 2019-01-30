require('dotenv').config()

import * as express from 'express';
// import * as Enum from 'enum';
const Enum = require('enum');

export const codes = new Enum({
    "BadRequest": { code: 400, message: "Bad Request" },
    "InternalServerError": { code: 500, message: "Internal Server Error" },
    "Forbidden": { code: 403, message: "Forbidden" },
    "NotFound": { code: 404, message: "Not Found" },
    "Unauthorized": { code: 401, message: "Unauthorized" },
});


export function send_status(code: number, error: any = "", response_object: express.Response, verbose: boolean = false) {

    const NODE_ENV = process.env.NODE_ENV;
    let message: string = "";

    switch (code) {
        
        case codes.BadRequest.value.code:
            message = codes.BadRequest.value.message;
            break;
        case codes.InternalServerError.value.code:
            message = codes.InternalServerError.value.message;
            break;
        case codes.Forbidden.value.code:
            message = codes.Forbidden.value.message;
            break;
        case codes.Unauthorized.value.code:
            message = codes.Unauthorized.value.message;
            break;
        case codes.NotFound.value.code:
            message = codes.NotFound.value.message;
            break;
        default:
            code = 500;
            message = codes.InternalServerError.value.message;
            break;
    }
    
    if (NODE_ENV === "development") {
        if (verbose) {
            console.log("error: ");
            console.log(error);
        }
        response_object.status(code).json({ code: code, message: message, error: error });
    } else {
        response_object.status(code).json({ code: code, message: message });
    }
}