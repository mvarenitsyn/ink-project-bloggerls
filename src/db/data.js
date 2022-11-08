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
exports.connectDB = exports.LikesModel = exports.RefreshTokenModel = exports.BloggerModel = exports.PostModel = exports.CommentModel = exports.UserModel = exports.refreshTokens = exports.postsCollection = exports.logsCollection = exports.commentsCollection = exports.usersCollection = exports.bloggersCollection = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const all_1 = require("../schemas/all");
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new mongodb_1.MongoClient(mongoUri);
const db = client.db("merndb");
exports.bloggersCollection = db.collection('bloggers');
exports.usersCollection = db.collection('users');
exports.commentsCollection = db.collection('comments');
exports.logsCollection = db.collection('logs');
exports.postsCollection = db.collection('posts');
exports.refreshTokens = db.collection('refreshtokens');
exports.UserModel = mongoose_1.default.model('User', all_1.userSchema);
exports.CommentModel = mongoose_1.default.model('Comment', all_1.commentSchema);
exports.PostModel = mongoose_1.default.model('Post', all_1.postSchema);
exports.BloggerModel = mongoose_1.default.model('Blogger', all_1.bloggerSchema);
exports.RefreshTokenModel = mongoose_1.default.model('Refreshtoken', all_1.refreshTokenSchema);
exports.LikesModel = mongoose_1.default.model('Like', all_1.LikeSchema);
//UserModel.watch().on('change', data => console.log(new Date(), data));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //await client.connect()
        yield mongoose_1.default.connect(mongoUri + '/merndb');
        console.log("Database connection was successfully");
    }
    catch (error) {
        console.log("Can't connect to database on " + mongoUri);
        //await client.close()
        yield mongoose_1.default.disconnect();
    }
});
exports.connectDB = connectDB;
