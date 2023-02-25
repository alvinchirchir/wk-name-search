import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true }), PrometheusModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
