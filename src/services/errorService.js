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
