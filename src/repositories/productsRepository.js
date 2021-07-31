const connection = require("../mysql-connection");

exports.insertVinho = (req, callback) => {
    const dados = req.body;

    const sql = `INSERT INTO ProdutosVinho ( 
        DescricaoVinho, 
        PrecoVinho,
        TipoVinho,
        ClassificacaoVinho,
        PaisVinho,
        GarrafaVinho,
        ComentarioVinho,
        CodigoErpVinho,
        Imagem1Vinho,
        Imagem1IdVinho,
        Imagem2Vinho,
        Imagem3Vinho
    ) 
    VALUES ( 
        ?,?,?, ?,?,?, ?,?,?, ?,?,?
    )`;

    const params = [
        dados.DescricaoVinho,
        dados.PrecoVinho,
        dados.TipoVinho,
        dados.ClassificacaoVinho,
        dados.PaisVinho,
        dados.GarrafaVinho,
        dados.ComentarioVinho,
        dados.CodigoErpVinho,
        dados.Imagem1Vinho,
        dados.Imagem1IdVinho,
        dados.Imagem2Vinho,
        dados.Imagem3Vinho,
    ];

    connection.query(sql, params, function (err, rows) {

        if (err || !rows.insertId > 0) { return callback(err, rows) };

        const data = {
            idProduct: rows.insertId,
            idProductVariation: dados.IdProductVariation,
            quantityProductVariation: dados.QuantityProductVariation,
            descriptionProductVariation: dados.DescriptionProductVariation,
            priceProductVariation: dados.PriceProductVariation,
        };

        insertProductVariation(data, () => {
            return callback(err, rows);
        });

    });
};

const insertProductVariation = (dados, callback) => {
    const sql = `INSERT INTO product_variation ( 
        IdProduct,
        QuantityProductVariation, 
        DescriptionProductVariation, 
        PriceProductVariation 
    ) 
    VALUES ( 
        ?, ?, ?, ? 
    )`;

    const params = [
        dados.idProduct,
        dados.quantityProductVariation,
        dados.descriptionProductVariation,
        dados.priceProductVariation,
    ];

    connection.query(sql, params, function (err, rows) {
        return callback();
    });
};



exports.delete = (req, callback) => {
    const { IdVinho } = req.query;

    deleteProductVariation( IdVinho, (ok) => {
        if (!ok) return( { message: "error when trying to delete the alternative product" }, null );

        const sql = "DELETE FROM ProdutosVinho WHERE IdVinho = ?";
        const params = [IdVinho];
        
        connection.query(sql, params, function (err, rows) {
            return callback(err, rows);
        });
    });
};

const deleteProductVariation = (idProduct, callback) => {
    const sql = `DELETE FROM product_variation WHERE IdProduct = ?`;
    const params = [idProduct];
    connection.query(sql, params, function (err, rows) {
        if (err || rows.affectedRows < 1 ) {
            console.log("deleteProductVariation.error", err);
            return callback(false);
        };
        return callback(true);
    });
};
