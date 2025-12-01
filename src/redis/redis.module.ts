import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService){
        console.log( configService.get('redis_server_host') ,1)
        console.log( configService.get('redis_server_port') ,2)
        const client = createClient({
          socket:{
            host: 'localhost',
            port:6379
          },
          // database: 1,
        })
        await client.connect();
        return client
      },
      inject:[ConfigService]
    },
  ],
  exports:[RedisService]
})
export class RedisModule {}
