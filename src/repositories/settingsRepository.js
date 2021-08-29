const connection = require('../mysql-connection');
const googleService = require('../services/googleService');

exports.get = (callback) => {
    let sql = `SELECT *
        FROM delivery_settings
        ORDER BY IdSettings`;
    connection.query(sql, function (error, rows) {
        return callback(error, rows);
    });
};

exports.insert = (req, callback) => {
    const dados = req.body;
    const sql =
        `INSERT INTO delivery_settings ( 
            AddressSellerSettings, 
            AppBannerSettings, 
            AppBannerPublicIdSettings, 

            AppBanner2Settings, 
            AppBanner2PublicIdSettings, 
            AppBanner3Settings, 

            AppBanner3PublicIdSettings, 
            AppLogoPSettings, 
            AppLogoPPublicIdSettings, 

            WebBannerSettings, 
            WebBannerPublicIdSettings, 
            UrlDeliveryMap, 

            UrlGooglePlay, 
            ContactPhone, 
            ContactEmail, 

            ContactWhatsapp, 
            DeliveryAreaDistance, 
            ShippingTaxSettings, 

            DeliveryAreaDistance2, 
            ShippingTax2Settings, 
            DeliveryAreaDistance3, 

            ShippingTax3Settings 
        ) 
        VALUES ( ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ? )`;

    const params = [
        dados.AddressSellerSettings,
        dados.AppBannerSettings,
        dados.AppBannerPublicIdSettings,

        dados.AppBanner2Settings,
        dados.AppBanner2PublicIdSettings,
        dados.AppBanner3Settings,

        dados.AppBanner3PublicIdSettings,
        dados.AppLogoPSettings,
        dados.AppLogoPPublicIdSettings,

        dados.WebBannerSettings,
        dados.WebBannerPublicIdSettings,
        dados.UrlDeliveryMap,

        dados.UrlGooglePlay,
        dados.ContactPhone,
        dados.ContactEmail,

        dados.ContactWhatsapp,
        dados.DeliveryAreaDistance,
        dados.ShippingTaxSettings,

        dados.DeliveryAreaDistance2,
        dados.ShippingTax2Settings,
        dados.DeliveryAreaDistance3,

        dados.ShippingTax3Settings,
    ];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

exports.put = (req, callback) => {
    const dados = req.body;

    const sql =
       `UPDATE delivery_settings 
        SET 
            AddressSellerSettings = ?, 
            AppBannerSettings = ?, 
            AppBannerPublicIdSettings = ?, 

            AppBanner2Settings = ?, 
            AppBanner2PublicIdSettings = ?, 
            AppBanner3Settings = ?, 

            AppBanner3PublicIdSettings = ?, 
            AppLogoPSettings = ?, 
            AppLogoPPublicIdSettings = ?, 

            WebBannerSettings = ?, 
            WebBannerPublicIdSettings = ?, 
            UrlDeliveryMap = ?, 

            UrlGooglePlay = ?, 
            ContactPhone = ?, 
            ContactEmail = ?, 

            ContactWhatsapp = ?, 
            DeliveryAreaDistance = ?, 
            ShippingTaxSettings = ?, 

            DeliveryAreaDistance2 = ?, 
            ShippingTax2Settings = ?, 
            DeliveryAreaDistance3 = ?, 

            ShippingTax3Settings = ? 
        WHERE IdSettings = ?`;

    const params = [
        dados.AddressSellerSettings,
        dados.AppBannerSettings,
        dados.AppBannerPublicIdSettings,

        dados.AppBanner2Settings,
        dados.AppBanner2PublicIdSettings,
        dados.AppBanner3Settings,

        dados.AppBanner3PublicIdSettings,
        dados.AppLogoPSettings,
        dados.AppLogoPPublicIdSettings,

        dados.WebBannerSettings,
        dados.WebBannerPublicIdSettings,
        dados.UrlDeliveryMap,

        dados.UrlGooglePlay,
        dados.ContactPhone,
        dados.ContactEmail,

        dados.ContactWhatsapp,
        dados.DeliveryAreaDistance,
        dados.ShippingTaxSettings,

        dados.DeliveryAreaDistance2,
        dados.ShippingTax2Settings,
        dados.DeliveryAreaDistance3,

        dados.ShippingTax3Settings,
        dados.IdSettings
    ];

    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

exports.changeOperationStatus = (req, callback) => {
    const dados = req.body;

    const sql =
       `UPDATE delivery_settings 
        SET OperationIsEnabledSettings = ? 
        WHERE IdSettings = ?`;

    const params = [
        dados.OperationIsEnabledSettings,
        dados.IdSettings
    ];

    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

exports.delete = (req, callback) => {
    const { IdSettings } = req.query;
    const sql = "DELETE FROM delivery_settings WHERE IdSettings = ?";
    const params = [IdSettings];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

exports.get_distance = async (req, callback) => {
    let sql = `SELECT AddressSellerSettings
           FROM delivery_settings`;
    connection.query(sql, async function (error, rows) {
        if (error) return callback(error, rows);

        let str1 = rows[0].AddressSellerSettings.replace(/ /g, "+");
        const sellerAddress = str1.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        str1 = req.params.address.replace(/ /g, "+");
        const customerAddress = str1.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const distance = 
            await googleService.getGoogleDistanceMatrix(sellerAddress, customerAddress);

        return callback(null, distance.rows[0].elements[0]);
    });
};
