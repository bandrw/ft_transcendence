import { IsNumber } from "class-validator";

export class CreateChatDTO {
	@IsNumber()
	userTwoId: number;
}
