import {refreshTokens} from "../db/data";
import {refreshToken} from "../db/types";

export const tokensRepository = {
    createToken: async (token: refreshToken) => {
        return await refreshTokens.insertOne(token)
    },

    getTokenData: async(tokenId: string) => {
        return await refreshTokens.findOne({token: tokenId})
    },

    deactivateToken: async(tokenId: string) => {
        return await refreshTokens.updateOne({token: tokenId}, {$set: {valid: false}})
    }
}