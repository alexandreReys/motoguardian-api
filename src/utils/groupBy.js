function groupBy (xs, key) {
    return xs.reduce(
        (rv, x) => ({
            ...rv, [x[key]]: [...(rv[x[key]] || []), x],
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

exports.groupedMax5 = function (list, prop) {
    return Object.fromEntries(
        Object.entries(groupBy(list, prop))
            .filter((arr) => arr[0] != "")
            .map((arr) => [arr[0], arr[1].slice(0, 5)])
    );
};

exports.groupedMax6 = function (list, prop) {
    return Object.fromEntries(
        Object.entries(groupBy(list, prop))
            .filter((arr) => arr[0] != "")
            .map((arr) => [arr[0], arr[1].slice(0, 6)])
    );
};
