import { IUser } from "../interfaces/user.interface";

export enum InviteType {
  student = 'student',
}

export type UserInviteDTO = Pick<IUser, 'email' | 'mobile' | 'firstname' | 'lastname'>;

export interface InviteDTO {
  type: InviteType;
  entity: string;

  users: UserInviteDTO[];
}
