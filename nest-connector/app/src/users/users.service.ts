import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarGenerator } from 'random-avatar-generator';
import { Repository } from 'typeorm';
import { User } from 'users/user.entity';
import { OnlineUser } from 'users/users.interface';

@Injectable()
export class UsersService {
	onlineUsers: OnlineUser[] = [];

	constructor(
		@InjectRepository(User)
		public usersRepository: Repository<User>,
	) {}

	findAll(expand = false): Promise<User[]> {
		if (expand)
			return this.usersRepository.find({ relations: ['wonGames', 'lostGames'] });
		return this.usersRepository.find();
	}

	findOneByLogin(login: string, expand = false) {
		if (expand)
			return this.usersRepository.findOne({ where: { login: login }, relations: ['wonGames', 'lostGames'] });
		return this.usersRepository.findOne({ where: { login: login } });
	}

	findOneById(id: number, expand = false): Promise<User> {
		if (expand)
			return this.usersRepository.findOne({ where: { id: id }, relations: ['wonGames', 'lostGames'] });
		return this.usersRepository.findOne({ where: { id: id } });
	}

	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async create(login: string, password: string) {
		const user = this.usersRepository.create();
		user.password = password;
		user.login = login;
		const salt = Math.random().toString();
		const generator = new AvatarGenerator();
		user.url_avatar = generator.generateRandomAvatar(salt);
		return await this.usersRepository.manager.save(user);
	}

	async updateAvatar(login: string) {
		const user = await this.usersRepository.findOne({
			where: { login: login },
		});
		const salt = Math.random().toString();
		const generator = new AvatarGenerator();
		const ret = generator.generateRandomAvatar(salt);
		user.url_avatar = ret;
		await this.usersRepository.manager.save(user);
		let i = 0;
		while (i < this.onlineUsers.length) {
			if (this.onlineUsers[i].login == user.login) {
				this.onlineUsers[i].id = user.id;
				this.onlineUsers[i].url_avatar = ret;
				this.userEvent('updateUser', this.onlineUsers[i]);
			}
			++i;
		}
		return ret;
	}

	userEvent(event: string, user: OnlineUser) {
		let i = 0;
		while (i < this.onlineUsers.length) {
			if (this.onlineUsers[i].login != user.login) {
				this.onlineUsers[i].resp.write(
					'event: ' +
					event +
					'\ndata: ' +
					JSON.stringify({
						id: user.id,
						login: user.login,
						url_avatar: user.url_avatar,
						status: user.status,
					}) +
					'\n\n',
				);
			}
			++i;
		}
	}

	userStatsEvent(stats) {
		let i = 0;
		while (i < this.onlineUsers.length) {
			this.onlineUsers[i].resp.write(
				'event: updateUsersStats\ndata: ' + JSON.stringify(stats) + '\n\n',
			);
			++i;
		}
	}

	broadcastEventData(event, data) {
		let i = 0;
		while (i < this.onlineUsers.length) {
			this.onlineUsers[i].resp.write(
				`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
			);
			++i;
		}
	}
}
