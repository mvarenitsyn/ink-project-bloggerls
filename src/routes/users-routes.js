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
exports.usersRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const UsersBusiness_1 = require("../domain/UsersBusiness");
const middleware_1 = require("../middleware");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', (0, express_validator_1.query)('PageNumber').isInt().optional({ checkFalsy: true }), (0, express_validator_1.query)('PageSize').isInt().optional({ checkFalsy: true }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : undefined;
    const pageSize = req.query.PageSize ? Number(req.query.PageSize) : undefined;
    res.status(200).json(yield UsersBusiness_1.usersRepo.getUsers(pageNumber, pageSize));
}));
exports.usersRouter.post('/', middleware_1.isAuthorized, (0, express_validator_1.body)('login').isLength({ min: 3, max: 10 }), (0, express_validator_1.body)('password').isLength({ min: 6, max: 20 }), (0, express_validator_1.body)('email').normalizeEmail().isEmail(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, email, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "errorsMessages": (0, utils_1.errorsAdapt)(errors.array({ onlyFirstError: true })) });
        return;
    }
    res.status(201).json(yield UsersBusiness_1.usersRepo.createUser(login, password, email));
}));
exports.usersRouter.delete('/:id', middleware_1.isAuthorized, middleware_1.isValidUserId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield UsersBusiness_1.usersRepo.deleteUser(req.params.id);
    res.sendStatus(204);
}));
