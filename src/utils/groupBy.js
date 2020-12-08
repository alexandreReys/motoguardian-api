function groupBy(xs, key) {
  return xs.reduce(
    (rv, x) => ({
      ...rv,
      [x[key]]: [...(rv[x[key]] || []), x],
    }),
    {}
  );
}
// exemplo uso = console.log(groupBy(products, 'TipoVinho'))

// function groupBy2(xs, key) {
//   return xs.reduce(
//     (rv, x) => ({
//       ...rv,
//       category: x[key],
//       ["products"]: [...(rv[x[key]] || []), x],
//     }),
//     {}
//   );
// }
// exemplo uso = console.log(groupBy(products, 'TipoVinho'))

module.exports = function groupedMax5(list, prop) {
  return Object.fromEntries(
    Object.entries(groupBy(list, prop))
      .filter((arr) => arr[0] != "")
      .map((arr) => [arr[0], arr[1].slice(0, 5)])
  );
};
// exemplo uso = console.log(groupedMax5(products, 'TipoVinho'))

// const products = [
//   {
//     IdVinho: 20,
//     DescricaoVinho: ' Whisky Jack Daniels 1L',
//     PrecoVinho: 151.9,
//     TipoVinho: 'Destilados',
//     ClassificacaoVinho: null,
//     PaisVinho: null,
//     GarrafaVinho: null,
//     ComentarioVinho: '',
//     CodigoErpVinho: '212112',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1-ONNGTsxEcI9wy5QIGbCkR27zpjKwDra',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 11,
//     DescricaoVinho: 'Brahma 473ml',
//     PrecoVinho: 3.39,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: '',
//     PaisVinho: '',
//     GarrafaVinho: '',
//     ComentarioVinho: '',
//     CodigoErpVinho: '000129',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=16e9pycK0hx-0HpYsPh1fp0LmmhetPniw',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 12,
//     DescricaoVinho: 'Brahma 600ml Vasilhame Incluso',
//     PrecoVinho: 7.4,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: '',
//     PaisVinho: '',
//     GarrafaVinho: '',
//     ComentarioVinho: '',
//     CodigoErpVinho: '',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1yDnvdRsYMhbaQS-vTb6lYXFFiyoM3p6g',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 19,
//     DescricaoVinho: 'Brahma Malzbier 355ml',
//     PrecoVinho: 3.99,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: null,
//     PaisVinho: null,
//     GarrafaVinho: null,
//     ComentarioVinho: '',
//     CodigoErpVinho: '000123',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1Any4evQLIxCJe71kEpkPi9Knmo2o0OCR',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 17,
//     DescricaoVinho: 'Budweiser 269ml',
//     PrecoVinho: 2.49,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: null,
//     PaisVinho: null,
//     GarrafaVinho: null,
//     ComentarioVinho: '',
//     CodigoErpVinho: '',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1Pc-YoxD67a0zKFItFn5qrPt9XmKpFiGc',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 15,
//     DescricaoVinho: 'Caracu 350ml',
//     PrecoVinho: 3.79,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: '',
//     PaisVinho: '',
//     GarrafaVinho: '',
//     ComentarioVinho: '',
//     CodigoErpVinho: '',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1GlZoii3x6B8rK8FPRRR-Y2e3h_aifHYy',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 24,
//     DescricaoVinho: 'Coca Cola 2 lts',
//     PrecoVinho: 10,
//     TipoVinho: 'Refrigerantes',
//     ClassificacaoVinho: null,
//     PaisVinho: null,
//     GarrafaVinho: null,
//     ComentarioVinho: '',
//     CodigoErpVinho: '000110',
//     Imagem1Vinho: '',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 16,
//     DescricaoVinho: 'Colorado Ribeir„o Lager 410ml',
//     PrecoVinho: 5.9,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: '',
//     PaisVinho: '',
//     GarrafaVinho: '',
//     ComentarioVinho: '',
//     CodigoErpVinho: '',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1Q-8-svnACicLTSjPLqBVxtdd6lsaxBKO',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 18,
//     DescricaoVinho: 'Corona Extra 330ml',
//     PrecoVinho: 4.99,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: null,
//     PaisVinho: null,
//     GarrafaVinho: null,
//     ComentarioVinho: '',
//     CodigoErpVinho: '001235',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1wPpc5b6VwDoJ9CDlHMaia1QZudW0TOgx',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 13,
//     DescricaoVinho: 'Original 600ml',
//     PrecoVinho: 7.49,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: '',
//     PaisVinho: '',
//     GarrafaVinho: '',
//     ComentarioVinho: '',
//     CodigoErpVinho: '',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1UuVOGYS7B6FFT0XimYy6MQ634oR23tMl',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 3,
//     DescricaoVinho: 'Skol Beats Senses 269ml',
//     PrecoVinho: 3.52,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: '.',
//     PaisVinho: '.',
//     GarrafaVinho: '269ml',
//     ComentarioVinho: '.',
//     CodigoErpVinho: '006930',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=12QHTpdFJRDkxBZrMXsa6k-xGhl9wdJ74',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 23,
//     DescricaoVinho: 'Skol Beats Senses 313ml',
//     PrecoVinho: 4.49,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: null,
//     PaisVinho: null,
//     GarrafaVinho: null,
//     ComentarioVinho: '',
//     CodigoErpVinho: '231234',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1P5op5Rh9-JXWidFyqbLti2J7Jdt64aIj',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 14,
//     DescricaoVinho: 'Stella Artois 310ml',
//     PrecoVinho: 3.49,
//     TipoVinho: 'Cervejas',
//     ClassificacaoVinho: '',
//     PaisVinho: '',
//     GarrafaVinho: '',
//     ComentarioVinho: '',
//     CodigoErpVinho: '',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1XICzjaBCPRYKg7T_xoN3VE5lo-APefqZ',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   },
//   {
//     IdVinho: 22,
//     DescricaoVinho: 'Vodka Smirnoff 998ml',
//     PrecoVinho: 35.9,
//     TipoVinho: 'Destilados',
//     ClassificacaoVinho: null,
//     PaisVinho: null,
//     GarrafaVinho: null,
//     ComentarioVinho: '',
//     CodigoErpVinho: '343432',
//     Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1nokr7LWdKb7AH_CcodDN0IycwKuBVo4k',
//     Imagem2Vinho: null,
//     Imagem3Vinho: null
//   }
//   ]

// //
// {
//   Destilados: [
//     {
//       IdVinho: 20,
//       DescricaoVinho: ' Whisky Jack Daniels 1L',
//       PrecoVinho: 151.9,
//       TipoVinho: 'Destilados',
//       ClassificacaoVinho: null,
//       PaisVinho: null,
//       GarrafaVinho: null,
//       ComentarioVinho: '',
//       CodigoErpVinho: '212112',
//       Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1-ONNGTsxEcI9wy5QIGbCkR27zpjKwDra',
//       Imagem2Vinho: null,
//       Imagem3Vinho: null
//     },
//     {
//       IdVinho: 22,
//       DescricaoVinho: 'Vodka Smirnoff 998ml',
//       PrecoVinho: 35.9,
//       TipoVinho: 'Destilados',
//       ClassificacaoVinho: null,
//       PaisVinho: null,
//       GarrafaVinho: null,
//       ComentarioVinho: '',
//       CodigoErpVinho: '343432',
//       Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1nokr7LWdKb7AH_CcodDN0IycwKuBVo4k',
//       Imagem2Vinho: null,
//       Imagem3Vinho: null
//     }
//   ],
//   Cervejas: [
//     {
//       IdVinho: 11,
//       DescricaoVinho: 'Brahma 473ml',
//       PrecoVinho: 3.39,
//       TipoVinho: 'Cervejas',
//       ClassificacaoVinho: '',
//       PaisVinho: '',
//       GarrafaVinho: '',
//       ComentarioVinho: '',
//       CodigoErpVinho: '000129',
//       Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=16e9pycK0hx-0HpYsPh1fp0LmmhetPniw',
//       Imagem2Vinho: null,
//       Imagem3Vinho: null
//     },
//     {
//       IdVinho: 12,
//       DescricaoVinho: 'Brahma 600ml Vasilhame Incluso',
//       PrecoVinho: 7.4,
//       TipoVinho: 'Cervejas',
//       ClassificacaoVinho: '',
//       PaisVinho: '',
//       GarrafaVinho: '',
//       ComentarioVinho: '',
//       CodigoErpVinho: '',
//       Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1yDnvdRsYMhbaQS-vTb6lYXFFiyoM3p6g',
//       Imagem2Vinho: null,
//       Imagem3Vinho: null
//     },
//     {
//       IdVinho: 19,
//       DescricaoVinho: 'Brahma Malzbier 355ml',
//       PrecoVinho: 3.99,
//       TipoVinho: 'Cervejas',
//       ClassificacaoVinho: null,
//       PaisVinho: null,
//       GarrafaVinho: null,
//       ComentarioVinho: '',
//       CodigoErpVinho: '000123',
//       Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1Any4evQLIxCJe71kEpkPi9Knmo2o0OCR',
//       Imagem2Vinho: null,
//       Imagem3Vinho: null
//     },
//     {
//       IdVinho: 17,
//       DescricaoVinho: 'Budweiser 269ml',
//       PrecoVinho: 2.49,
//       TipoVinho: 'Cervejas',
//       ClassificacaoVinho: null,
//       PaisVinho: null,
//       GarrafaVinho: null,
//       ComentarioVinho: '',
//       CodigoErpVinho: '',
//       Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1Pc-YoxD67a0zKFItFn5qrPt9XmKpFiGc',
//       Imagem2Vinho: null,
//       Imagem3Vinho: null
//     },
//     {
//       IdVinho: 15,
//       DescricaoVinho: 'Caracu 350ml',
//       PrecoVinho: 3.79,
//       TipoVinho: 'Cervejas',
//       ClassificacaoVinho: '',
//       PaisVinho: '',
//       GarrafaVinho: '',
//       ComentarioVinho: '',
//       CodigoErpVinho: '',
//       Imagem1Vinho: 'https://drive.google.com/uc?export=view&id=1GlZoii3x6B8rK8FPRRR-Y2e3h_aifHYy',
//       Imagem2Vinho: null,
//       Imagem3Vinho: null
//     }
//   ],
//   Refrigerantes: [
//     {
//       IdVinho: 24,
//       DescricaoVinho: 'Coca Cola 2 lts',
//       PrecoVinho: 10,
//       TipoVinho: 'Refrigerantes',
//       ClassificacaoVinho: null,
//       PaisVinho: null,
//       GarrafaVinho: null,
//       ComentarioVinho: '',
//       CodigoErpVinho: '000110',
//       Imagem1Vinho: '',
//       Imagem2Vinho: null,
//       Imagem3Vinho: null
//     }
//   ]
// }

module.exports = function groupedMax6(list, prop) {
  console.log("groupedMax6-list", list);
  return Object.fromEntries(
    Object.entries(groupBy(list, prop))
      .filter((arr) => arr[0] != "")
      .map((arr) => [arr[0], arr[1].slice(0, 6)])
  );
};