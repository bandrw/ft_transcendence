import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from "socket.io";
import { UsersService } from "users/users.service";

@WebSocketGateway({ cors: true })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(private usersService: UsersService) {}

	handleConnection(socket: Socket): void {
		this.usersService.handleConnection(socket);
	}

	handleDisconnect(socket: Socket): void {
		this.usersService.handleDisconnect(socket);
	}
}
