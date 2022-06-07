export enum AuthenticationStatus {
  Pending = 'Pending',
  NotLogged = 'NotLogged',
  Logged = 'Logged',
}

export interface AuthenticationUser {
  displayName: string;
  email: string;
  uuid: string;
  avatarUrl?: string;
}

export interface AuthenticationState {
  state: AuthenticationStatus;
  user?: AuthenticationUser;
}
