import { BaseService } from './base.service'

export class AuthService extends BaseService {
  static async login(username: string, password: string): Promise<{ token: string }> {
    const service = new AuthService()
    return service.post<{ token: string }>('/auth/login', { username, password })
  }
}
