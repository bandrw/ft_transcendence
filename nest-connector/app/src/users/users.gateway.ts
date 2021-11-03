import { Injectable } from "@nestjs/common";
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from "socket.io";

@Injectable()
@WebSocketGateway({ cors: true })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {

	public static users = new Map<string, string>();
	public static sockets = new Map<string, Socket>();

	@WebSocketServer() server: Server;

	handleConnection(socket: Socket): void {
		UsersGateway.users.set(socket.id, '');
		UsersGateway.sockets.set(socket.id, socket);
	}

	handleDisconnect(socket: Socket): void {
		UsersGateway.users.delete(socket.id);
		UsersGateway.sockets.delete(socket.id);
	}
}
