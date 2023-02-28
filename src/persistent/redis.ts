/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisClient {
    async createClient() {
        try {
            const client = createClient({
                socket: {
                    tls: false,
                    host:process.env.REDIS_URL,
                    port:parseInt(process.env.REDIS_PORT)
                },
            });
            await client.connect();
            client.on('error', async () => {
                console.log("Error connecting")
            });
            return client;
        } catch (error) {
            Logger.debug('Redis Client Error: ', error.message);
            return;
        }
    }
}
