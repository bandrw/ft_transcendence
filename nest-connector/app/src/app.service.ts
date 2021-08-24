import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Injectable()
export class AppService {
  baseApp(@Res() response: Response) {
    const file = createReadStream('src/app.html');
    file.pipe(response);
    // return '<!DOCTYPE html>\n' +
    //     '<html lang="en">\n' +
    //     '<head>\n' +
    //     '    <meta charset="UTF-8">\n' +
    //     '    <title id="title"></title>\n' +
    //     '    <link rel="stylesheet" type="text/css" href="css/style_nest.css">' +
    //     '    <script src="js/vue.js"></script>' +
    //     '    <script src="js/jquery.js"></script>' +
    //     '    <script src="js/app.js"></script>' +
    //     '</head>\n' +
    //     '<body>\n' +
    //     '    <div id="app">' +
    //     '        <div id="chat"></div>' +
    //     '        <div id="user"></div>' +
    //     '    </div>\n' +
    //     '</body>\n' +
    //     '</html>';
  }
}
