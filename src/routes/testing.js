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
exports.testing = void 0;
const express_1 = require("express");
const data_1 = require("../db/data");
exports.testing = (0, express_1.Router)({});
exports.testing.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield data_1.BloggerModel.deleteMany({});
    yield data_1.PostModel.deleteMany({});
    yield data_1.UserModel.deleteMany({});
    yield data_1.CommentModel.deleteMany({});
    yield data_1.RefreshTokenModel.deleteMany({});
    yield data_1.LikesModel.deleteMany({});
    res.sendStatus(204);
    return;
}));
