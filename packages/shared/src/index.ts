// Shared package entry point
export const APP_NAME = 'Sample App';

export type User = {
  id: string;
  name: string;
  email: string;
};

export const formatUserName = (user: User): string => {
  return user.name.trim();
};

export const createUser = (name: string, email: string): User => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: name.trim(),
    email: email.toLowerCase().trim(),
  };
};
