/*class SringHelper {

    static yout(obj) {
        console.dir(obj, { depth: null })
    }

    static camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return match.toUpperCase().trim();
        });
    }
}

export default SringHelper;

*/

exports.yout = function(obj) {
    console.dir(obj, { depth: null })
}

exports.camelize = function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return match.toUpperCase().trim();
    });
}