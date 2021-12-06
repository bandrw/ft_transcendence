import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateChatDTO {
	@IsNumber()
	userTwoId: number;
}

export class MuteChatMemberDTO {
	@IsNumber()
	chatId: number;

	@IsNumber()
	memberId: number;

	@IsString()
	@IsOptional()
	unbanDate: string | null;
}

export class UnmuteChatMemberDTO {
	@IsNumber()
	chatId: number;

	@IsNumber()
	memberId: number;
}
