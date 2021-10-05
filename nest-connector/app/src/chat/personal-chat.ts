import { OnlineUser } from '../users/users.interface';

export class PersonalChat {
  constructor(
    public userOne: OnlineUser,
    public userTwo: OnlineUser,
    public id: number,
  ) {}
}
