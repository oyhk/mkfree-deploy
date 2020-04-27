import { Module } from '@nestjs/common';
import { LogWebsocket } from './log-websocket';

@Module({
  providers: [LogWebsocket],
})
export class LogWebsocketModule {
}

