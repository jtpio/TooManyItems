var Utils = Utils || {};

Utils.random =  function(min, max) {
    return Math.floor((Math.random() * (max - min) + min));
};

Utils.euclidian = function(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return Math.sqrt(dx*dx + dy*dy);
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

Utils.secondsToString = function(seconds) {
    var min = Math.floor(seconds/60);
    var s = Math.round(seconds - min * 60);

    var res = s + '"';
    if (s < 10) res = "0" + res;
    res = min + '\'' + res;
    if (min < 10) res = "0" + res;
    return res;
};

Utils.setBit = function(n, i) {
    return (n | (1 << i));
};

Utils.getBit = function(n, i) {
    return ((n & (1 << i)) !== 0);
};