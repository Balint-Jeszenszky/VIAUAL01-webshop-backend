import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'static/images',
    filename: (req, file, cb) => {
        const name = file.originalname;
        const ext = path.extname(name);
        cb(null, `${name.substr(0, name.length - 4).split(' ').join('_')}_${Date.now()}_${Math.random().toString(36).substring(2,6)}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024*1024
    },
    fileFilter: (req, file, cb) => {
        const name = file.originalname;
        const ext = path.extname(name);
        const fileTypes = /jpeg|jpg|png|gif/;
        const valid = fileTypes.test(ext.toLowerCase()) && fileTypes.test(file.mimetype);
        cb(null, valid);
    }
}).single('productImage');

export default upload;