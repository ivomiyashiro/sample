import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/config';

@Injectable()
export class SupabaseService {
  private supabaseAdmin: SupabaseClient;
  private supabaseClient: SupabaseClient;

  constructor() {
    // Admin client with service role key for server-side operations
    this.supabaseAdmin = createClient(
      config().SUPABASE_URL,
      config().SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Regular client with anon key for user operations
    this.supabaseClient = createClient(
      config().SUPABASE_URL,
      config().SUPABASE_ANON_KEY,
    );
  }

  /**
   * Get admin client for server-side operations
   */
  getAdminClient(): SupabaseClient {
    return this.supabaseAdmin;
  }

  /**
   * Get regular client for user operations
   */
  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Get client with user session
   */
  getClientWithAuth(accessToken: string): SupabaseClient {
    return createClient(config().SUPABASE_URL, config().SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }
}
