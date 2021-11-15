import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelController } from 'channel/channel.controller';
import { ChannelService } from 'channel/channel.service';
import { ChannelEntity } from "channel/entities/channel.entity";
import { ChannelMemberEntity } from "channel/entities/channelMember.entity";

@Module({
	imports: [TypeOrmModule.forFeature([ChannelEntity, ChannelMemberEntity])],
	controllers: [ChannelController],
	providers: [ChannelService]
})
export class ChannelModule {}
