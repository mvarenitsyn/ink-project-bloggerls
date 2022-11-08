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
exports.tokensRepository = void 0;
const data_1 = require("../db/data");
exports.tokensRepository = {
    createToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const newToken = new data_1.RefreshTokenModel(token);
        return yield newToken.save().then(result => {
            return result._id;
        }).catch(err => {
            return false;
        });
    }),
    getTokenData: (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.RefreshTokenModel.findOne({ token: tokenId }).lean();
    }),
    deactivateToken: (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.RefreshTokenModel.updateOne({ token: tokenId }, { valid: false }).lean();
    })
};
