import fse from 'fs-extra';

import multer from 'multer';
import mime from 'mime-types';

export default (uploadPath, maximumFileSize, fileTypes) => {

    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {

            try {
                await fse.ensureDir(uploadPath);
                // dir has now been created, including the directory it is to be placed in
            } catch (err) {
                console.log(err);
                const multerError = new multer.MulterError();
                multerError.message = `Can not create directory with path: ${uploadPath}`;
                return cb(multerError)
            }

            // console.log(file)
            // console.log(req.body)
            return cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = mime.extension(file.mimetype);
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
        },
    });
    const fileFilter = (req, file, cb) => {

        const fileExtension = mime.extension(file.mimetype);

        if (fileTypes.some(type => type.toLowerCase() === fileExtension.toLowerCase())) {
            return cb(null, true);
        }

        console.log('can\'t upload this type of files');
        const multerError = new multer.MulterError()
        multerError.message = 'File doest\'t accepted!';
        return cb(multerError);

    }
    return multer({
        storage, fileFilter: fileFilter, limits: { fileSize: maximumFileSize }
    });
    // return multer({ dest: uploadPath });

}