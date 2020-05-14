import { Response } from "express";

export function handleError(res: Response, err: any, statusCode = 400) {
    console.log('Error', err);
    return res.status(statusCode).send(err);
}
         
