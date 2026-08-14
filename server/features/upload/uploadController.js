const { success } = require('../../utils/apiResponse');
const { AppError } = require('../../utils/error');

exports.uploadAvatar = (req, res, next) => {
    try {
        if (!req.file) {
            throw new AppError('No file uploaded', 400);
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;

        return success(res, {
            url: `${baseUrl}/uploads/${req.file.filename}`,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        }, 'File uploaded successfully', 201);
    } catch (error) {
        next(error);
    }
};