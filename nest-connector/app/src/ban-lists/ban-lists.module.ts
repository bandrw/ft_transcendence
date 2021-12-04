import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { BanListsEntity } from "ban-lists/ban-lists.entity";
import { BanListsService } from 'ban-lists/ban-lists.service';

@Module({
	imports: [TypeOrmModule.forFeature([BanListsEntity])],
	providers: [BanListsService]
})
export class BanListsModule {}
