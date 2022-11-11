import {isAuthorized, isValidDeviceId, isValidRefreshToken} from "../middleware";
import {Request, Response, Router} from "express";
import {SecurityDevices} from "../domain/SecurityDevicesBusiness";


export const securityDevices = Router({})

const devices = new SecurityDevices()

securityDevices.get('/devices', isValidRefreshToken,
     async (req: Request, res: Response) => {
        const deviceList = await devices.getUserDevices(req.cookies.refreshToken)
         console.log(deviceList)
        if (deviceList) {
            res.status(200).json(deviceList)
            return
        }
        return
    })

//

securityDevices.delete('/devices/',  isValidRefreshToken,
    async (req: Request, res: Response) => {
        const loggedOff = await devices.logOff(req.cookies.refreshToken)
        loggedOff ? res.sendStatus(204) : res.sendStatus(401)
        return
    })

securityDevices.delete('/devices/:id', isValidRefreshToken,
    async (req: Request, res: Response) => {
    if(req.params.id && await devices.deviceIdExits(req.params.id)) {
        if(await devices.checkUserDevices(req.cookies.refreshToken, req.params.id)) {
            const loggedOff = await devices.logOff(req.cookies.refreshToken, req.params.id)
            loggedOff ? res.sendStatus(204) : res.sendStatus(404)
        } else {
            res.sendStatus(403)
        }
    } else {
        res.sendStatus(404)
    }
    })

