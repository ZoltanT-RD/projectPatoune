const getClassString = (classArray) => {

    typeof stringValue

    if (classArray) {

        if (Array.isArray(classArray)){
            return classArray.join(" ");
        }
        if (typeof(classArray) === "string") {
            return classArray;
        }
    }
    else{
        return "";
    }

}
module.exports = getClassString;