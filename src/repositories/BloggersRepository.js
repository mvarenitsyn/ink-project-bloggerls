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
exports.bloggersDBRepository = void 0;
const data_1 = require("../db/data");
exports.bloggersDBRepository = {
    getBloggers: (name, pageNum, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = name ? { name: { $regex: name, $options: 'ig' } } : {};
        const resultCount = yield data_1.BloggerModel.countDocuments(filter);
        const bloggers = yield data_1.BloggerModel.find(filter, { projection: {
                _id: 0,
            } })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .lean();
        return [resultCount, bloggers];
    }),
    getBloggerById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = { id: id };
        return data_1.BloggerModel.findOne(filter, { projection: { _id: 0 } });
    }),
    deleteBloggerById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = { id: id };
        return data_1.BloggerModel.deleteOne(filter);
    }),
    updateBloggerById: (id, name, youtubeUrl) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = { id: id };
        return data_1.BloggerModel.updateOne(filter, { $set: { name: name, youtubeUrl: youtubeUrl } });
    }),
    createBlogger: (blogger) => __awaiter(void 0, void 0, void 0, function* () {
        const newBlogger = new data_1.BloggerModel(blogger);
        return yield newBlogger.save().then(result => {
            return {
                "id": result.id,
                "name": result.name,
                "youtubeUrl": result.youtubeUrl
            };
        }).catch(err => {
            return false;
        });
    }),
};
