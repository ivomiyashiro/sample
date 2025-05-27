import { Session } from '@supabase/supabase-js';
import { SessionDTO } from '../dtos';

export class SessionMapper {
  static mapToSessionDTO(session: Session): SessionDTO {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
    };
  }
}
