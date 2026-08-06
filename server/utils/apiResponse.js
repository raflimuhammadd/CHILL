function success(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
        success: true,
        message,
    };

    if (data !== null && data !== undefined) {
        response.data = data;
    }
    return res.status(statusCode).json(resposne);
}

function error (res, message = 'Internal server error', statusCode = 500, code = null) {
    const response = {
        success: false,
        message,
    };

    if (code) {
        response.code = code;
    }
    return res.status(statusCode).json(response);
}

module.exports = {
    success,
    error,
};