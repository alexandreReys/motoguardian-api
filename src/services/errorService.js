exports.handleError = function (err, res) {
    if (err.code == "EUSEREXCEPTION") {
        res.status(200).send({ error: err.message });

    } else {
        console.log('');
        console.log('Error =======>', err.message, err.code);
        console.log('');

        res.status(400).send({ 
            errorCode: err.code,
            errorMessage: err.message, 
        });
    };
};

exports.handleErrorOlder = function (err, res) {
    if (err.code == "EUSEREXCEPTION") {
        console.log('Error =======>', err.message);
        res.status(200).send({ error: err.message });

    } else if (err.code == "ECONNRESET") {
        console.log('');
        console.log('Error =======>', err.message, err.code);
        console.log('');
        res.status(400).send({ message: err.code });

    } else if (err.code == "ENOTFOUND") {
        console.log('');
        console.log('Error =======>', err.message, err.code);
        console.log('');
        res.status(400).send({ message: "ENOTFOUND" });

    } else if (err.code == "ETIMEDOUT") {
        console.log('');
        console.log('Error =======>', err.message);
        console.log('');
        res.status(400).send({ error: err.message });

    } else if (err.code == 'ER_NO_SUCH_TABLE') {
        console.log('');
        console.log('Error =======>', err.message);
        console.log('');
        res.status(400).send({ error: err.message });

    } else {
        console.log('');
        console.log('Error =======>', err.message, err.code);
        console.log('');

        res.status(400).send({ 
            errorCode: err.code,
            errorMessage: err.message, 
        });
    };
};
