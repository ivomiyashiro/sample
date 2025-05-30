import { UserDTO } from '@sample/shared';

import { User } from '@supabase/supabase-js';

export class UserMapper {
  static mapToUserDTO(user: User): UserDTO {
    const userObj: UserDTO = {
      userId: user.id,
      email: user.email,
    };

    return userObj;
  }
}
