import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true }), PrometheusModule.register(),
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 10,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService,    {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },],
})
export class AppModule { }
