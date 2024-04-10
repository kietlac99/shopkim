import * as RedisStoreService from './redisStore.service';

export async function scanController(req, res) {
    try {
        const { scanType, keyword } = req.body;
        const process = await RedisStoreService.scanService(scanType, keyword);
        return res.RH.success(process);
    } catch (error) {
        return res.RH.error(error);
    }
}