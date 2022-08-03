import {logsCollection} from "../db/data";
import {logDBtype} from "../db/types";

export const LoggingRepository = {
    logRequest: async (log: logDBtype) => {
        return await logsCollection.insertOne(log)
    },
    getRequests: async (action: string, ip: string, date: Date) => {
        return await logsCollection.countDocuments({$and: [{action: action}, {ip: ip}, {time: {$gt: date}}]})
    }

}