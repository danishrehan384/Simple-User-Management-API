import { ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { Request } from "express";
import { CONSTANTSS } from "utils/consts";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();


        for (let x = 0; x < CONSTANTSS.BY_PASS_URL.length; x++) {
            if (req.method == CONSTANTSS.BY_PASS_URL[x].METHOD && req.url == CONSTANTSS.BY_PASS_URL[x].URL) {
                return true;
            }
        }

        return super.canActivate(context);


    }
}