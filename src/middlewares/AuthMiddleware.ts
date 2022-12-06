import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '../auth/auth.service'


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  
  constructor(private authService: AuthService) {}
  
  async use(req: Request, res: Response, next: () => void) {
    
    if (req.headers['authorization']) {
      const user = await this.authService.getUserByToken(req.headers['authorization'])      
      
      if (!user) {
        throw new ForbiddenException(
          'Please login and retry.',
        )
      }

      Object.assign(req.body, { id: user.id })

      next()
    } else {
      throw new UnauthorizedException('authorization token required.')
    }
    
  }
}
