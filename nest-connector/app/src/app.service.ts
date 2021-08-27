import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Injectable()
export class AppService {
  baseApp(@Res() response: Response) {
    const file = createReadStream('src/app.html');
    file.pipe(response);
  }
}
