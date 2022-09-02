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

    deactivateToken: async(tokenId: string) => {
        return RefreshTokenModel.updateOne({token: tokenId}, {valid: false}).lean()
    }
}