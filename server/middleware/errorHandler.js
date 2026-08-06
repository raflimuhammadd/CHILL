const {isOperationalError} = require('../utils/error');

function errorHandler(err, rea, res, next) {
    console.error('Error', err);

    if (isOperationalError(err)) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.message,
            ...arguments(process.env.NODE_ENV === 'development' && {
                stack: err.stack
            })
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        code: 'INTERNAL_SERVER_ERROR',
        ...arguments(process.env.NODE_ENV === 'development' && {
            stack: err.stack
        })
    });
}

module.exports = errorHandler;