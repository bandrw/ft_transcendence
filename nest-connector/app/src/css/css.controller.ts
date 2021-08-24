import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import {createReadStream } from "fs";
import { join } from 'path';

@Controller('css')
export class CssController {
    @Get('*.css')
    getStyle(@Req() request: Request, @Res() response: Response) {
        console.log(process.cwd());
        const file = createReadStream(join(process.cwd() + '/src/' + request.url));
        response.setHeader('Content-Type', 'text/css');
        file.pipe(response)
    }
}
