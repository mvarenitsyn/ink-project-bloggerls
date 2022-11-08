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
exports.usersRepo = void 0;
const mongodb_1 = require("mongodb");
const UserServices_1 = require("./UserServices");
const UsersRepository_1 = require("../repositories/UsersRepository");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
exports.usersRepo = {
    createUser: (login, password, email) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield UserServices_1.userServices.hashPassword(password);
        const result = yield UsersRepository_1.usersDBRepository.createUser({
            _id: new mongodb_1.ObjectId(),
            userData: {
                login: login,
                password: hashedPassword,
                email: email,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: (0, uuid_1.v4)().toString(),
                expirationDate: (0, add_1.default)(new Date(), {
                    hours: 1,
                    minutes: 5
                }),
                isConfirmed: false
            }
        });
        if (result) {
            return {
                "id": result.toString(),
                "login": login
            };
        }
        else
            return null;
    }),
    getUsers: (pageNumber = 1, pageSize = 10) => __awaiter(void 0, void 0, void 0, function* () {
        const userCount = yield UsersRepository_1.usersDBRepository.countUsers({});
        const pagesCount = Math.ceil(userCount / pageSize);
        const users = yield UsersRepository_1.usersDBRepository.getUsers(pageNumber, pageSize);
        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": userCount,
            "items": users
        };
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield UsersRepository_1.usersDBRepository.deleteUser(new mongodb_1.ObjectId(id));
    }),
    getUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield UsersRepository_1.usersDBRepository.getUser(new mongodb_1.ObjectId(id));
        }
        catch (e) {
            return null;
        }
    }),
    getUserByLogin: (login) => __awaiter(void 0, void 0, void 0, function* () {
        return yield UsersRepository_1.usersDBRepository.getUser(login);
    }),
    updateUserConfirmationCode: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const code = (0, uuid_1.v4)().toString();
        yield UsersRepository_1.usersDBRepository.updateConfirmationCode(email, code);
        return code;
    })
};
