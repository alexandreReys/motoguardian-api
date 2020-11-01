const { cloudinary } = require("../../config/cloudinary");

exports.upload = async function (req, res) {
    try {
        const response = await cloudinary.uploader.upload(
            req.body.data,
            { upload_preset: 'adega_da_vila' }
        );

        res.json({
            url: response.url,
            public_id: response.public_id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Something went wrong" });
    };
};

exports.delete = async function (req, res) {
    try {
        if (!req.query.publicId) { return res.json({ msg: "OK" }) };

        await cloudinary.uploader.destroy( req.query.publicId );
        res.json({ msg: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Something went wrong" });
    };
};
