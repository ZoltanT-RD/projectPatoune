exports.yout = function(obj) {
    console.dir(obj, { depth: null })
}

exports.camelize = function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return match.toUpperCase().trim();
    });
}

exports.getStringFromTo = function (source, fromString, fromPadding, endString, endPadding) {
    let begin = source.indexOf(fromString) + fromPadding;
    let end = source.indexOf(endString, begin) + endPadding;
    return source.substring(begin, end);
}