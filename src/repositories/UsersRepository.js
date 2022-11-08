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
exports.usersDBRepository = void 0;
const data_1 = require("../db/data");
exports.usersDBRepository = {
    createUser: (newUser) => __awaiter(void 0, void 0, void 0, function* () {
        const user = new data_1.UserModel(newUser);
        return yield user.save().then(result => {
            return result._id;
        }).catch(err => {
            return false;
        });
    }),
    getUsers: (pageNumber = 1, pageSize = 10) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield data_1.UserModel.find({})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();
        return users.map(user => {
            return { id: user._id.toString(), login: user.userData.login };
        });
    }),
    countUsers: (filter) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.UserModel.estimatedDocumentCount(filter);
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.UserModel.deleteOne({ _id: id });
    }),
    getUser: (filter) => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof filter === "string") {
            return data_1.UserModel.findOne({ "userData.login": filter });
        }
        else {
            return data_1.UserModel.findOne({ _id: filter });
        }
    }),
    checkUserEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.UserModel.findOne({ "userData.email": email });
    }),
    checkConfirmationCode: (code) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.UserModel.findOne({ "emailConfirmation.confirmationCode": code });
    }),
    confirmUser: (code) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.UserModel.updateOne({ "emailConfirmation.confirmationCode": code }, { $set: { "emailConfirmation.isConfirmed": true } });
    }),
    updateConfirmationCode: (email, code) => __awaiter(void 0, void 0, void 0, function* () {
        return data_1.UserModel.updateOne({ "userData.email": email }, { $set: { "emailConfirmation.confirmationCode": code } });
    })
};
/*
export const usersDBRepository = {
    createUser: async (newUser: userDBtype) => {
        return await usersCollection.insertOne(newUser)
    },

    getUsers: async (pageNumber: number = 1, pageSize: number = 10) => {
        return await usersCollection.find({})
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .map(user => {
            return {id: user._id.toString(), login: user.userData.login}
        }).toArray()

    },

    countUsers: async (filter: Object) => {
        return usersCollection.countDocuments(filter)
    },

    deleteUser: async (id: ObjectId) => {
        return await usersCollection.deleteOne({_id: id})
    },

    getUser: async (filter: ObjectId | string) => {
        if(typeof filter === "string") {
            return usersCollection.findOne({"userData.login": filter});
        }
        else {
            return usersCollection.findOne({_id: filter});
        }
    },
    checkUserEmail: async (email:string) => {
        return usersCollection.findOne({"userData.email": email});
    },
    checkConfirmationCode: async (code:string) => {
        return await usersCollection.findOne({"emailConfirmation.confirmationCode": code});
    },
    confirmUser: async (code:string) => {
        return await usersCollection.updateOne({"emailConfirmation.confirmationCode": code},{$set: {"emailConfirmation.isConfirmed": true}});
    },
    updateConfirmationCode: async (email: string, code: string) => {
        return await usersCollection.updateOne({"userData.email": email}, {$set: {"emailConfirmation.confirmationCode": code}})
    }
}*/
