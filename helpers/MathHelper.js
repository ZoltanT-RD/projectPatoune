exports.randomIntInclusiveBetween = function (min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}


exports.getRoundedExp = function (num) {
    return Math.round(Math.exp(num)); // 3, 7, 20, 55, 148
}