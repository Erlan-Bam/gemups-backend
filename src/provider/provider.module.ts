import { Module } from '@nestjs/common';
import { SevenOneOneService } from './sevenoneone/sevenoneone.service';

@Module({ providers: [SevenOneOneService], exports: [SevenOneOneService] })
export class ProviderModule {}
