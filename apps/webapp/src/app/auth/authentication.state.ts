export enum AuthenticationStatus {
  Pending = 'Pending',
  // NotLogged = 'NotLogged',
  // Logging = 'Logging',
  Logged = 'Logged',
}

export interface AuthenticationUser {
  uuid: string;
  name: string;
}

export interface AuthenticationState {
  state: AuthenticationStatus;
  user?: AuthenticationUser;
}
