import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarGenerator } from 'random-avatar-generator';
import { DeleteResult, Repository } from 'typeorm';
import { UserSubscription } from "users/entities/subscription.entity";
import { User } from 'users/entities/user.entity';
import { OnlineUser } from 'users/users.interface';

@Injectable()
export class UsersService {
	onlineUsers: OnlineUser[] = [];

	constructor(
		@InjectRepository(User)
		public usersRepository: Repository<User>,
		@InjectRepository(UserSubscription)
		public userSubscriptionRepository: Repository<UserSubscription>
	) {}

	async findAll(expand = false): Promise<User[]> {
		if (!expand)
			return this.usersRepository.find();

		const users = await this.usersRepository.find({ relations: ['wonGames', 'lostGames', 'subscriptions', 'subscribers'] });
		for (let i = 0; i < users.length; ++i) {
			const subscriptionsExpand: any = [];
			for (let j = 0; j < users[i].subscriptions.length; ++j) {
				subscriptionsExpand.push(await this.findOneById(users[i].subscriptions[j].targetId, false));
			}
			users[i].subscriptions = subscriptionsExpand;

			const subscribersExpand: any = [];
			for (let j = 0; j < users[i].subscribers.length; ++j)
				subscribersExpand.push(await this.findOneById(users[i].subscribers[j].userId, false));
			users[i].subscribers = subscribersExpand;
		}
		return users;
	}

	findOneByLogin(login: string, expand = false) {
		if (expand)
			return this.usersRepository.findOne({ where: { login: login }, relations: ['wonGames', 'lostGames', 'subscriptions', 'subscribers'] });
		return this.usersRepository.findOne({ where: { login: login } });
	}

	async findOneById(id: number, expand = false): Promise<User> {
		if (expand)
			return this.usersRepository.findOne({ where: { id: id }, relations: ['wonGames', 'lostGames', 'subscriptions', 'subscribers'] });
		return this.usersRepository.findOne({ where: { id: id } });
	}

	async subscribeToUser(login: string, targetLogin: string): Promise<UserSubscription> {
		const user = await this.findOneByLogin(login, true);
		if (!user)
			throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
		const target = await this.findOneByLogin(targetLogin);
		if (!target)
			throw new HttpException('Target not found', HttpStatus.BAD_REQUEST);

		if (user.subscriptions.find(s => s.targetId === target.id))
			throw new HttpException('Already subscribed', HttpStatus.BAD_REQUEST);

		const subscription = this.userSubscriptionRepository.create();
		subscription.user = user;
		subscription.target = target;
		const r = await this.userSubscriptionRepository.save(subscription);
		if (r) {
			const onlineUser = this.onlineUsers.find(usr => usr.id === user.id);
			onlineUser.subscriptions.push(target);
			this.userEvent('updateUser', onlineUser);

			const onlineTarget = this.onlineUsers.find(usr => usr.id === target.id);
			onlineTarget.subscribers.push(user);
			this.userEvent('updateUser', onlineTarget);
		}
		return r;
	}

	async unsubscribeFromUser(login: string, targetLogin: string): Promise<DeleteResult> {
		const user = await this.findOneByLogin(login, true);
		if (!user)
			throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
		const target = await this.findOneByLogin(targetLogin);
		if (!target)
			throw new HttpException('Target not found', HttpStatus.BAD_REQUEST);

		if (!user.subscriptions.find(s => s.targetId === target.id))
			throw new HttpException('Already unsubscribed', HttpStatus.BAD_REQUEST);

		const r = await this.userSubscriptionRepository.delete({ userId: user.id, targetId: target.id });
		if (r) {
			const onlineUser = this.onlineUsers.find(usr => usr.id === user.id);
			onlineUser.subscriptions = onlineUser.subscriptions.filter(s => s.id !== target.id);
			this.userEvent('updateUser', onlineUser);

			const onlineTarget = this.onlineUsers.find(usr => usr.id === target.id);
			onlineTarget.subscribers = onlineTarget.subscribers.filter(s => s.id !== user.id);
			this.userEvent('updateUser', onlineTarget);
		}
		return r;
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
		for (let i = 0; i < this.onlineUsers.length; ++i) {
			// if (broadcast || this.onlineUsers[i].login != user.login) {
				const data = JSON.stringify({
					id: user.id,
					login: user.login,
					url_avatar: user.url_avatar,
					status: user.status,
					subscriptions: user.subscriptions,
					subscribers: user.subscribers
				});
				this.onlineUsers[i].socket.emit(event, data);
			// }
		}
	}

	userStatsEvent(stats) {
		for (let i = 0; i < this.onlineUsers.length; ++i) {
			this.onlineUsers[i].socket.emit('updateUsersStats', JSON.stringify(stats));
		}
	}

	broadcastEventData(event: string, data: string) {
		for (let i = 0; i < this.onlineUsers.length; ++i) {
			this.onlineUsers[i].socket.emit(event, data);
		}
	}
}
