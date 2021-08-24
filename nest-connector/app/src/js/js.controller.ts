import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from "express";
import { createReadStream } from "fs";
import { join } from "path";

@Controller('js')
export class JsController {
    @Get('*.js')
    getJs(@Req() request: Request, @Res() response: Response) {
        const file = createReadStream(join(process.cwd() + '/src/' + request.url));
        response.setHeader('Content-Type', 'application/javascript');
        file.pipe(response);
    }
}
