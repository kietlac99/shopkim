import * as RedisClient from '../../util/Redis';
import colors from "colors";
import errorMessage from "../../util/error";

export async function scanService(scanType, keyword) {
    try {
        const data = await RedisClient.findKeysContainingString(
            scanType, keyword);
        
        return data;
    } catch (error) {
        console.log(colors.red(`scanDeletedService error: ${error}`));
        return errorMessage(500, ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
}