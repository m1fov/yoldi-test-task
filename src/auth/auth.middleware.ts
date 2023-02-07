import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiToken = req.headers.authorization;

    if (!apiToken || apiToken !== process.env.API_TOKEN) {
      throw new UnauthorizedException();
    }

    next();
  }
}
