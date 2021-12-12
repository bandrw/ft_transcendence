import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';

export const saveImageToStorage = {
	storage: diskStorage({
		destination: '/uploads',
		filename: (req, file, callback) => {
			const fileExtension = file.originalname.split('.').pop();
			const fileName = uuidv4() + '.' + fileExtension;
			callback(null, fileName);
		},
	}),
	filter: (req: Request, file: Express.Multer.File, callback) => {
		const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
		callback(null, allowedMimeTypes.includes(file.mimetype));
	}
};
