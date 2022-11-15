import {userDBtype} from "../db/types";
import {UserModel, usersCollection} from "../db/data";
import {ObjectId} from "mongodb";

export const usersDBRepository = {
    createUser: async (newUser: userDBtype) => {
        const user = new UserModel(newUser)
        return await user.save().then(result => {
            return result._id
        }).catch(err => {
            return false
        })


    },
    getUsers: async (pageNumber: number = 1, pageSize: number = 10): Promise<object[]> => {
        const users = await UserModel.find({})
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .lean()

        return users.map(user => {
            return {id: user._id.toString(), login: user.userData.login}
        })

    },
    countUsers: async (filter: Object) => {
        return UserModel.estimatedDocumentCount(filter)
    },
    deleteUser: async (id: ObjectId) => {
        return UserModel.deleteOne({_id: id});
    },
    getUser: async (filter: ObjectId | string) => {
        if(typeof filter === "string") {
            return UserModel.findOne({"userData.login": filter});
        }
        else {
            return UserModel.findOne({_id: filter});
        }
    },
    checkUserEmail: async (email:string) => {
        return UserModel.findOne({"userData.email": email});
    },
    checkConfirmationCode: async (code:string) => {
        return UserModel.findOne({"emailConfirmation.confirmationCode": code});
    },
    checkEmailConfirmationCode: async (email:string, code:string) => {
        return UserModel.findOne({"emailConfirmation.confirmationCode": code, "userData.email": email});
    },
    confirmUser: async (code:string) => {
        return UserModel.updateOne({"emailConfirmation.confirmationCode": code}, {$set: {"emailConfirmation.isConfirmed": true}});
    },
    updateConfirmationCode: async (email: string, code: string) => {
        return UserModel.updateOne({"userData.email": email}, {$set: {"emailConfirmation.confirmationCode": code}});
    },
    updateUserPassword: async (code: string, newPassword: string) => {
        return UserModel.updateOne({"emailConfirmation.confirmationCode": code}, {$set: {"userData.password": newPassword}});
    }

}

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
