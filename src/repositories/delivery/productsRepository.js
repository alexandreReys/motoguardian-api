const connection = require("../../mysql-connection");

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
        return callback(err, rows);
    });
};