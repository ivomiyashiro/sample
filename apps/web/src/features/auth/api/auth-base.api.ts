import { config } from '@/config';
import { BaseApiService } from '@/lib/api';

class AuthBaseApi extends BaseApiService {
  constructor() {
    super({
      baseURL: `${config().API_BASE_URL}/auth`,
    });
  }
}

export default AuthBaseApi;
