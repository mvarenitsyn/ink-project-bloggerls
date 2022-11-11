import {RefreshTokenModel, refreshTokens, UserModel} from "../db/data";
import {refreshToken} from "../db/types";

export const tokensRepository = {
    createToken: async (token: refreshToken) => {
        const newToken = new RefreshTokenModel(token)
        return await newToken.save().then(result => {
            return result._id
        }).catch(err => {
            return false
        })
    },

    getTokenData: async(tokenId: string) => {
        return RefreshTokenModel.findOne({token: tokenId}).lean()
    },
    getTokenDataByDevice: async(deviceId: string) => {
        return RefreshTokenModel.findOne({deviceId: deviceId}).lean()
    },

    deactivateToken: async(tokenId: string) => {
        return RefreshTokenModel.updateOne({token: tokenId}, {valid: false}).lean()
    },

    updateToken: async(deviceId: string) => {
        const time = new Date()
        const q = await RefreshTokenModel.updateOne({deviceId: deviceId}, {issuedAt: time})
        if (q.acknowledged) {
            return time
        } else {
            return false
        }
    }
}