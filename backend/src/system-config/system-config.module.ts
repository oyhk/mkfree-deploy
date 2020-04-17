import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfig } from './system-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemConfig])]
})
export class SystemConfigModule {}