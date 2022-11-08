"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectId = exports.validateSeq = exports.errorsAdapt = void 0;
const express_validator_1 = require("express-validator");
const errorsAdapt = (errors) => {
    const adaptedErrors = [];
    errors.map((el) => {
        adaptedErrors.push({ message: el.msg.toString(), field: el.param.toString() });
    });
    if (adaptedErrors.length > 0) {
        return adaptedErrors;
    }
    else
        return undefined;
};
exports.errorsAdapt = errorsAdapt;
const validateSeq = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ "errorsMessages": (0, exports.errorsAdapt)(errors.array({ onlyFirstError: true })) });
    });
};
exports.validateSeq = validateSeq;
const isObjectId = (id) => {
    return id.split('').length === 24;
};
exports.isObjectId = isObjectId;
