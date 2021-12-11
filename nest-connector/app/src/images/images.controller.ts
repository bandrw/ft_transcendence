import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller('images')
export class ImagesController {

	@Get(':filename')
	getImage(@Param('filename') filename: string, @Res() res) {
		res.sendFile(filename, { root: '../uploads' });
	}

}
