import {userDBtype} from "../db/types";
import {usersCollection} from "../db/data";
import {ObjectId} from "mongodb";

export const usersDBRepository = {
    createUser: async (newUser: userDBtype) => {
        return await usersCollection.insertOne(newUser)
    },

    getUsers: async (pageNumber: number = 1, pageSize: number = 10) => {
        return await usersCollection.find({})
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .map(user => {
            return {id: user._id.toString(), login: user.login}
        }).toArray()

    },

    countUsers: async (filter: Object) => {
        return usersCollection.countDocuments(filter)
    },

    deleteUser: async (id: ObjectId) => {
        return await usersCollection.deleteOne({_id: id})
    }
}