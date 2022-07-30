import {validationResult, ValidationChain} from "express-validator";
import express from 'express'

type ErrorType = {
    [index: string]: string
}

export const errorsAdapt = (errors: object[]) => {
    const adaptedErrors: ErrorType[] = []
    errors.map((el:any) => {
        adaptedErrors.push({message: el.msg.toString(), field: el.param.toString()})
    })
    if (adaptedErrors.length > 0) {
        return adaptedErrors
    } else return undefined

}

export const validateSeq = (validations: ValidationChain[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))});
    };
};

export const isObjectId = (id:string) => {
    return id.split('').length === 24
}

