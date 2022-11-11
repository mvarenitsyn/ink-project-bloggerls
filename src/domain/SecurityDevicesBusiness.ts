import {SecurityDevicesRespository} from "../repositories/SecurityDevicesRespository";
import jwt, {Secret} from "jsonwebtoken"

export class SecurityDevices {
    protected sessionsData = new SecurityDevicesRespository()
    constructor() {
    }

    async getUserDevices(token: string) {
        interface JwtPayload {
            id: string,
            deviceId: string,
            issuedAt: string,
        }
        try {
            const secret = process.env.JWT_SECRET
            const {id} = jwt.verify(token, secret as Secret) as JwtPayload

            const sessions = await this.sessionsData.getUserDevices(id)
            if(id && sessions) {
                return sessions.map(session => {
                   return {
                       ip: session.ip,
                       title: session.deviceName,
                       lastActivatedDate: session.issuedAt,
                       deviceId: session.deviceId
                   }
                })
            } else {
                return false
            }

        } catch (e) {
            return false
        }
    }
    async checkUserDevices(token: string, checkId:string) {
        interface JwtPayload {
            id: string,
            deviceId: string,
            issuedAt: string,
        }
        try {
            const secret = process.env.JWT_SECRET
            const {id} = jwt.verify(token, secret as Secret) as JwtPayload

            const isBelong = await this.sessionsData.checkUserDeviceId(id, checkId)
            if(isBelong) {
                return true
            } else {
                return false
            }

        } catch (e) {
            return false
        }
    }
    async logOff(token: string, deleteId?: string) {
        interface JwtPayload {
            id: string,
            deviceId: string,
            issuedAt: string,
        }
        try {
            const secret = process.env.JWT_SECRET
            const {id, deviceId} = jwt.verify(token, secret as Secret) as JwtPayload
            if(id) {
                if(deleteId) {
                    return await this.sessionsData.deleteDeviceSession(deleteId)
                } else {
                    return await this.sessionsData.deleteUserSessions(id, deviceId)
                }
            }

        } catch (e) {
        return false
        }
    }



}