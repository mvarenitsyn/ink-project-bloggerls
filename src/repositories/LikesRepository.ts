import {ObjectId} from "mongodb";
import {LikesModel} from "../db/data";
import {like} from "../db/types"

export class Likes {
    constructor(protected parentId: string, protected userData?: { userId: ObjectId, login: string }) {
        this.parentId = parentId
        this.userData = userData
    }

    async list(limit: number = 0): Promise<like[]> {
        return await LikesModel.find({parentId: this.parentId})
            .select('-__v -_id -parentId -myStatus')
            .where({"myStatus": "Like"})
            .sort({addedAt: "descending"}).limit(limit).lean().exec()
    }



    async like(): Promise<boolean> {
        const query = await LikesModel.updateOne({$and: [{parentId: this.parentId}, {userId: this.userData?.userId}]}, {
            myStatus: 'Like',
            addedAt: new Date(),
            userId: this.userData?.userId,
            login: this.userData?.login,
            parentId: this.parentId
        }, {upsert: true})
        return query.modifiedCount === 1

        //await LikesModel.updateOne({parentId: this.parentId}, {status:
        // 'like'}).where('userId').equals(this.userData?.userId)
    }

    async reset(): Promise<boolean> {
        const query = await LikesModel.updateOne({$and: [{parentId: this.parentId}, {userId: this.userData?.userId}]}, {
            myStatus: 'None',
            addedAt: new Date(),
            userId: this.userData?.userId,
            login: this.userData?.login,
            parentId: this.parentId
        }, {upsert: true})
        return query.modifiedCount === 1
    }

    async dislike(): Promise<boolean> {

        const query = await LikesModel.updateOne({$and: [{parentId: this.parentId}, {userId: this.userData?.userId}]}, {
            myStatus: 'Dislike',
            addedAt: new Date(),
            userId: this.userData?.userId,
            login: this.userData?.login,
            parentId: this.parentId
        }, {upsert: true})
        return query.modifiedCount === 1
    }

    async getStatus(): Promise<like | null> {
        return await LikesModel.findOne({$and: [{parentId: this.parentId}, {userId: this.userData?.userId}]}).lean().exec()
    }
    async deleteAll(): Promise<any> {
        return await LikesModel.deleteMany({parentId: this.parentId}).lean().exec()
    }

    async getLikesCount(): Promise<number> {
        return await LikesModel.where({'parentId': this.parentId}).where({'myStatus': 'Like'}).countDocuments().exec()
    }

    async getDislikesCount(): Promise<number> {
        return await LikesModel.where({'parentId': this.parentId}).where({'myStatus': 'Dislike'}).countDocuments().exec()
    }


}


export class LikesRepository {
    constructor() {
    }

    async list(limit: number = 0, parentId: string): Promise<like[]> {
        return await LikesModel.find({"parentId": parentId})
            .select('-__v -_id -parentId -status')
            .or([{"status": "Like"}, {"status": "Dislike"}])
            .sort({createdAt: "ascending"}).limit(limit).lean().exec()
    }



    async like(userId: string, login: string, parentId: string): Promise<boolean> {
        const query = await LikesModel.updateOne({$and: [{parentId: parentId}, {userId: userId}]}, {
            status: 'Like',
            createdAt: new Date(),
            userId: userId,
            login: login,
            parentId: parentId
        }, {upsert: true})
        return query.modifiedCount === 1

        //await LikesModel.updateOne({parentId: this.parentId}, {status:
        // 'like'}).where('userId').equals(this.userData?.userId)
    }

    async reset(userId: string, login: string, parentId: string): Promise<boolean> {
        const query = await LikesModel.updateOne({$and: [{parentId: parentId}, {userId: userId}]}, {
            status: 'None',
            createdAt: new Date(),
            userId: userId,
            login: login,
            parentId: parentId
        }, {upsert: true})
        return query.modifiedCount === 1
    }

    async dislike(userId: string, login: string, parentId: string): Promise<boolean> {
        const query = await LikesModel.updateOne({$and: [{parentId: parentId}, {userId: userId}]}, {
            status: 'Dislike',
            createdAt: new Date(),
            userId: userId,
            login: login,
            parentId: parentId
        }, {upsert: true})
        return query.modifiedCount === 1
    }

    async getStatus(userId: string): Promise<string> {
        const status = await LikesModel.findOne({userId: userId}).select('myStatus -_id').lean().exec()
        return status ? status.myStatus : 'None'
    }
    async deleteAll(parentId: string): Promise<any> {
        return await LikesModel.deleteMany({parentId: parentId}).lean().exec()
    }

    async getLikesCount(parentId: string): Promise<number> {
        return await LikesModel.where({'parentId': parentId}).where({'status': 'Like'}).countDocuments().exec()
    }

    async getDislikesCount(parentId: string): Promise<number> {
        return await LikesModel.where({'parentId': parentId}).where({'status': 'Dislike'}).countDocuments().exec()
    }


}