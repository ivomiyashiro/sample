import { User } from '@supabase/supabase-js';
import { UserDTO } from '../dtos';

export class UserMapper {
  static mapToUserDTO(user: User): UserDTO {
    const userObj = {
      userId: user.id,
      email: user.email,
      createdAt: user.created_at,
    };

    return userObj;
  }
}
