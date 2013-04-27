var Utils = Utils || {};

Utils.random =  function(min, max) {
    return (Math.random() * (max - min) + min);
};

Utils.transpose = function(matrix) {
    var transposed = [];
    var i, j = 0;
    for (j = 0; j < matrix[0].length; j++) {
        transposed[j] = [];
    }
    for (i = 0; i < matrix.length; i++) {
        for (j = 0; j < matrix[i].length; j++) {
            transposed[j][i] = matrix[i][j];
        }
    }
    return transposed;
};