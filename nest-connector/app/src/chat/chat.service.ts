import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PersonalChat } from './personal-chat';

@Injectable()
export class ChatService {
  @Inject(UsersService)
  private usersService: UsersService;
  private personalChats: PersonalChat[] = [];

  createNewPersonalChat(loginOne: string, loginTwo: string) {
    let userOne;
    let userTwo;
    let i = 0;
    while (i < this.usersService.onlineUsers.length) {
      if (this.usersService.onlineUsers[i].login === loginOne) {
        userOne = this.usersService.onlineUsers[i];
      } else if (this.usersService.onlineUsers[i].login === loginTwo) {
        userTwo = this.usersService.onlineUsers[i];
      }
      if (userOne && userTwo) {
        break;
      }
      ++i;
    }
    this.personalChats.push(
      new PersonalChat(userOne, userTwo, this.personalChats.length),
    );
  }

  transferMessage(id: number, to: string, message: string) {
    if (this.personalChats[id].userOne.login === to) {
      this.personalChats[id].userOne.resp.write(
        `event: personalMessage\ndata: ${message}`,
      );
    } else {
      this.personalChats[id].userTwo.resp.write(
        `event: personalMessage\ndata: ${message}`,
      );
    }
  }

  // removePersonalChat(personalChat: PersonalChat) {
  //   personalChat.userOne.resp.write(
  //     `event: personalChatClose\ndata: ${personalChat.userTwo.login}\n\n`,
  //   );
  //   personalChat.userTwo.resp.write(
  //     `event: personalChatClose\ndata: ${personalChat.userOne.login}\n\n`,
  //   );
  //   this.personalChats[personalChat.id] = null;
  // }
}
