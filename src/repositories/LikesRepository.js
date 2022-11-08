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
exports.LikesRepository = exports.Likes = void 0;
const data_1 = require("../db/data");
class Likes {
    constructor(parentId, userData) {
        this.parentId = parentId;
        this.userData = userData;
        this.parentId = parentId;
        this.userData = userData;
    }
    list(limit = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_1.LikesModel.find({ parentId: this.parentId })
                .select('-__v -_id -parentId -myStatus')
                .where({ "myStatus": "Like" })
                .sort({ addedAt: "descending" }).limit(limit).lean().exec();
        });
    }
    like() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield data_1.LikesModel.updateOne({ $and: [{ parentId: this.parentId }, { userId: (_a = this.userData) === null || _a === void 0 ? void 0 : _a.userId }] }, {
                myStatus: 'Like',
                addedAt: new Date(),
                userId: (_b = this.userData) === null || _b === void 0 ? void 0 : _b.userId,
                login: (_c = this.userData) === null || _c === void 0 ? void 0 : _c.login,
                parentId: this.parentId
            }, { upsert: true });
            return query.modifiedCount === 1;
        });
    }
    reset() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield data_1.LikesModel.updateOne({ $and: [{ parentId: this.parentId }, { userId: (_a = this.userData) === null || _a === void 0 ? void 0 : _a.userId }] }, {
                myStatus: 'None',
                addedAt: new Date(),
                userId: (_b = this.userData) === null || _b === void 0 ? void 0 : _b.userId,
                login: (_c = this.userData) === null || _c === void 0 ? void 0 : _c.login,
                parentId: this.parentId
            }, { upsert: true });
            return query.modifiedCount === 1;
        });
    }
    dislike() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield data_1.LikesModel.updateOne({ $and: [{ parentId: this.parentId }, { userId: (_a = this.userData) === null || _a === void 0 ? void 0 : _a.userId }] }, {
                myStatus: 'Dislike',
                addedAt: new Date(),
                userId: (_b = this.userData) === null || _b === void 0 ? void 0 : _b.userId,
                login: (_c = this.userData) === null || _c === void 0 ? void 0 : _c.login,
                parentId: this.parentId
            }, { upsert: true });
            return query.modifiedCount === 1;
        });
    }
    getStatus() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_1.LikesModel.findOne({ $and: [{ parentId: this.parentId }, { userId: (_a = this.userData) === null || _a === void 0 ? void 0 : _a.userId }] }).lean().exec();
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_1.LikesModel.deleteMany({ parentId: this.parentId }).lean().exec();
        });
    }
    getLikesCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_1.LikesModel.where({ 'parentId': this.parentId }).where({ 'myStatus': 'Like' }).countDocuments().exec();
        });
    }
    getDislikesCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_1.LikesModel.where({ 'parentId': this.parentId }).where({ 'myStatus': 'Dislike' }).countDocuments().exec();
        });
    }
}
exports.Likes = Likes;
class LikesRepository {
    constructor() {
    }
    list(limit = 0, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_1.LikesModel.find({ "parentId": parentId })
                .select('-__v -_id -parentId -status')
                .or([{ "status": "Like" }, { "status": "Dislike" }])
                .sort({ addedAt: "descending" }).limit(limit).lean().exec();
        });
    }
    like(userId, login, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield data_1.LikesModel.updateOne({ $and: [{ parentId: parentId }, { userId: userId }] }, {
                status: 'Like',
                addedAt: new Date(),
                userId: userId,
                login: login,
                parentId: parentId
            }, { upsert: true });
            return query.modifiedCount === 1;
            //await LikesModel.updateOne({parentId: this.parentId}, {status:
            // 'like'}).where('userId').equals(this.userData?.userId)
        });
    }
    reset(userId, login, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield data_1.LikesModel.updateOne({ $and: [{ parentId: parentId }, { userId: userId }] }, {
                status: 'None',
                addedAt: new Date(),
                userId: userId,
                login: login,
                parentId: parentId
            }, { upsert: true });
            return query.modifiedCount === 1;
        });
    }
    dislike(userId, login, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield data_1.LikesModel.updateOne({ $and: [{ parentId: parentId }, { userId: userId }] }, {
                status: 'Dislike',
                addedAt: new Date(),
                userId: userId,
                login: login,
                parentId: parentId
            }, { upsert: true });
            return query.modifiedCount === 1;
        });
    }
    getStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield data_1.LikesModel.findOne({ userId: userId }).select('myStatus -_id').lean().exec();
            return status ? status.myStatus : 'None';
        });
    }
    deleteAll(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_1.LikesModel.deleteMany({ parentId: parentId }).lean().exec();
        });
    }
    getLikesCount(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_1.LikesModel.where({ 'parentId': parentId }).where({ 'status': 'Like' }).countDocuments().exec();
        });
    }
    getDislikesCount(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_1.LikesModel.where({ 'parentId': parentId }).where({ 'status': 'Dislike' }).countDocuments().exec();
        });
    }
}
exports.LikesRepository = LikesRepository;
