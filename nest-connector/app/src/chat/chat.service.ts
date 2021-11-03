import { Inject, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { PersonalChat } from './personal-chat';

@Injectable()
export class ChatService {
  @Inject(UsersService)
  private usersService: UsersService;
  private personalChats: PersonalChat[] = [];

  createNewPersonalChat(from: string, to: string) {
    let fromUser;
    let toUser;
    let i = 0;
    let fromUserIndex;
    let toUserIndex;
    while (i < this.usersService.onlineUsers.length) {
      if (this.usersService.onlineUsers[i].login === from) {
        fromUser = this.usersService.onlineUsers[i];
        fromUserIndex = i;
      } else if (this.usersService.onlineUsers[i].login === to) {
        toUser = this.usersService.onlineUsers[i];
        toUserIndex = i;
      }
      if (fromUser && toUser) {
        break;
      }
      ++i;
    }
    if (i === this.usersService.onlineUsers.length) {
      // this.personalChats.push(
      //   new PersonalChat(fromUser, toUser, this.personalChats.length),
      // );
      // this.usersService.onlineUsers[fromUserIndex].resp.write(
      //   `event: chatProperties\ndata: {id: ${i}, name: ${this.usersService.onlineUsers[toUserIndex].login}}`,
      // );
      // this.usersService.onlineUsers[toUserIndex].resp.write(
      //   `event: chatProperties\ndata: {id: ${i}, name: ${this.usersService.onlineUsers[fromUserIndex].login}}`,
      // );
    }
  }

  transferPersonalMessage(id: number, to: string, message: string) {
    // if (this.personalChats[id].userOne.login === to) {
    //   this.personalChats[id].userOne.resp.write(
    //     `event: personalMessage\ndata: ${message}`,
    //   );
    // } else {
    //   this.personalChats[id].userTwo.resp.write(
    //     `event: personalMessage\ndata: ${message}`,
    //   );
    // }
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
