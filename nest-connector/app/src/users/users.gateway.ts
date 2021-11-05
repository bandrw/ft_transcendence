import { Inject, Injectable } from "@nestjs/common";
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { UsersService } from "users/users.service";

@Injectable()
@WebSocketGateway({ cors: true })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@Inject()
	private usersService: UsersService;

	public static users = new Map<string, string>();
	public static sockets = new Map<string, Socket>();

	@WebSocketServer() server: Server;

	handleConnection(socket: Socket): void {
		UsersGateway.users.set(socket.id, '');
		UsersGateway.sockets.set(socket.id, socket);
	}

	handleDisconnect(socket: Socket): void {
		if (UsersGateway.users.get(socket.id)) {
			const disconnectedLogin = UsersGateway.users.get(socket.id);
			this.usersService.userEvent('logout', this.usersService.onlineUsers.find(usr => usr.login === disconnectedLogin));
			this.usersService.onlineUsers = this.usersService.onlineUsers.filter(usr => usr.login !== disconnectedLogin);
		}
		UsersGateway.users.delete(socket.id);
		UsersGateway.sockets.delete(socket.id);
	}
}
