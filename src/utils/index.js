module.exports = function userException(message) {
    return {
        message,
        code: 'EUSEREXCEPTION',
    };
};
