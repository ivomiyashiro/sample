import { User } from '@supabase/supabase-js';
import { UserDTO } from '@sample/shared';

export class UserMapper {
  static mapToUserDTO(user: User): UserDTO {
    const userObj: UserDTO = {
      userId: user.id,
      email: user.email,
    };

    return userObj;
  }
}
