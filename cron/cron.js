import cron from 'node-cron';
import { scanService } from '../backend/components/redisStore/redisStore.service';
import * as RedisClient from '../backend/util/Redis';
import { EXPIRES_TIME_CHANGE, SCAN_REDIS_KEY_TYPE, DEFAULT_AVATAR } from '../backend/constants';
import cloudinary from 'cloudinary';

import { API_DOCS_HOST } from '../backend/config';
import axios from 'axios';

export default async function cronJob() {
    cron.schedule('0 0 * * *', async () => {
        const deletedProduct = scanService(SCAN_REDIS_KEY_TYPE.DELETED_PRODUCT, '');
        if (deletedProduct.length < 1) return true;
        for (const product of deletedProduct) {
            const time = await RedisClient.timeRemaining(product?.key);
            if (time <= EXPIRES_TIME_CHANGE) {
                // Deleting images associated with the product
                for (let i = 0; i < product?.value?.images?.length; i++) {
                    await cloudinary.v2.uploader.destroy(product?.value?.images[i]?.public_id);
                }
            }
        }
    }, {
        scheduled: true,
        timezone: 'Asia/Bangkok'
    });

    cron.schedule('0 0 * * *', async () => {
        const deletedUser = scanService(SCAN_REDIS_KEY_TYPE.DELETED_USER, '');
        if (deletedUser.length < 1) return true;
        for (const user of deletedUser) {
            const time = await RedisClient.timeRemaining(user?.key);
            if (time <= EXPIRES_TIME_CHANGE) {
                if (user?.value?.avatar?.public_id !== DEFAULT_AVATAR.public_id) {
                    const image_id = user?.value?.avatar?.public_id;
                    if (image_id) {
                        await cloudinary.v2.uploader.destroy(image_id);
                    }
                }
            }
        }
    }, {
        scheduled: true,
        timezone: 'Asia/Bangkok'
    });

    cron.schedule('0 0 * * *', async () => {
        const userRegister = scanService(SCAN_REDIS_KEY_TYPE.USER_REGISTRATION, '');
        if (userRegister.length < 1) return true;
        for (const user of userRegister) {
            const time = await RedisClient.timeRemaining(user?.key);
            if (time <= (EXPIRES_TIME_CHANGE - 30 * 60)) {
                if (user?.value?.avatar?.public_id !== DEFAULT_AVATAR.public_id) {
                    const image_id = user?.value?.avatar?.public_id;
                    if (image_id) {
                        await cloudinary.v2.uploader.destroy(image_id);
                    }
                }
            }
        }
    }, {
        scheduled: true,
        timezone: 'Asia/Bangkok'
    });

    // Schedule a job to ping the server every 4 minutes
    cron.schedule('*/4 * * * *', async () => {
        try {
            await axios({
                url: `https://${API_DOCS_HOST}/ping`,
                method: "GET",
            });
            console.log('Ping successful');
        } catch (error) {
            console.error('Ping failed:', error);
        }
    }, {
        scheduled: true,
        timezone: 'Asia/Bangkok'
    });
}