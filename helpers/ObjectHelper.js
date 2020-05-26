exports.renameKey = function (obj,oldKey,newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey]; // Delete old key
    return obj;
}