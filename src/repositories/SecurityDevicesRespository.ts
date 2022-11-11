import {RefreshTokenModel} from "../db/data";


export class SecurityDevicesRespository {

    constructor() {
    }

    async getUserDevices(userId: string) {
        try {
            return await RefreshTokenModel.find({user: userId, valid: true}).lean()
        } catch (e) {
            return false
        }
    }
    async checkUserDeviceId(userId: string, deviceId: string) {
        try {
            return await RefreshTokenModel.findOne({user: userId, deviceId: deviceId}).lean()
        } catch (e) {
            return false
        }
    }

    async checkDeviceId(deviceId: string) {
        try {
            return await RefreshTokenModel.findOne({deviceId: deviceId}).lean()
        } catch (e) {
            return false
        }
    }
    async deleteDeviceSession(deviceId: string) {
        try {
            const res = await RefreshTokenModel.deleteOne({deviceId: deviceId}).lean()
            return !!res.deletedCount
        } catch (e) {
            return false
        }
    }
    async deleteUserSessions(userId: string, deviceId: string) {
        try {
            const res = await RefreshTokenModel.deleteMany({user: userId, deviceId: {$ne: deviceId}}).lean()
            return !!res.deletedCount
        } catch (e) {
            return false
        }
    }
}