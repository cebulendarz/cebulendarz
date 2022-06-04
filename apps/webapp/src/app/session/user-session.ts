import { v4 } from 'uuid';

class UserSession {
  getSessionId(): string {
    const uuid = localStorage.getItem('user-session-uuid');
    if (uuid) {
      return uuid;
    } else {
      const newUuid = v4();
      localStorage.setItem('user-session-uuid', newUuid);
      return newUuid;
    }
  }
  getUserName(): string | null {
    return localStorage.getItem('user-name');
  }
  setUserName(name: string): void {
    localStorage.setItem('user-name', name);
  }
}

export const userSession = new UserSession();
