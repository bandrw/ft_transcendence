import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User_table } from '../user.entity';
import { Connection } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User_table)
        private usersRepository: Repository<User_table>,
        // private connection: Connection
    ) {}

    findAll(): Promise<User_table[]> {
        return this.usersRepository.find();
    }

    findOne(id: string): Promise<User_table> {
        return this.usersRepository.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
    async create(login: string, password: string) {
        let user = this.usersRepository.create()
        user.password = password;
        user.login = login;
        await this.usersRepository.manager.save(user);
        // const queryRunner = this.connection.createQueryRunner();
        // await queryRunner.connect();
        // await queryRunner.startTransaction();
        // try {
        //     await queryRunner.manager.
        // }
    }
}