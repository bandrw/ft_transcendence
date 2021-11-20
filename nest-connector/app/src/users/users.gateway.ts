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
		this.usersService.usersSocketIds.set(socket.id, '');
		this.usersService.sockets.set(socket.id, socket);
	}

	handleDisconnect(socket: Socket): void {
		if (this.usersService.usersSocketIds.get(socket.id)) {
			const disconnectedLogin = this.usersService.usersSocketIds.get(socket.id);
			this.usersService.userEvent('logout', this.usersService.onlineUsers.find(usr => usr.login === disconnectedLogin));
			this.usersService.onlineUsers = this.usersService.onlineUsers.filter(usr => usr.login !== disconnectedLogin);
		}
		this.usersService.usersSocketIds.delete(socket.id);
		this.usersService.sockets.delete(socket.id);
	}
}
