export type LoginRequest = {
  emailOrUsername: string;
  password: string;
};

export type AuthUser = {
  id?: string;
  email?: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user?: AuthUser;
};

