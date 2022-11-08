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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db/db");
exports.userServices = {
    hashPassword: (password) => {
        const saltRounds = 10;
        return bcrypt_1.default.hash(password, saltRounds);
    },
    compareHashedPassword: (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, hash);
    }),
    logRequest: (action, ip, time) => {
        const newLog = {
            action: action,
            ip: ip,
            time: time
        };
        db_1.requestLog.push(newLog);
    },
    getRequests: (action, ip, time) => {
        return db_1.requestLog.filter(request => request.action === action && request.ip === ip && request.time > time);
    }
};
