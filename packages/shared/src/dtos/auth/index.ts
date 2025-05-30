export type UserDTO = {
  userId: string;
  email: string | undefined;
};

export type SessionDTO = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | undefined;
};

export type AuthResultDTO = {
  user: UserDTO;
  session: SessionDTO;
};

export type OAuthSignInResult = {
  url: string;
};

export type SignInDTO = {
  email: string;
  password: string;
};

export type SignUpDTO = {
  email: string;
  password: string;
};
