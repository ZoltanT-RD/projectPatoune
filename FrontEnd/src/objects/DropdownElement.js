export default class DropdownElement {
    constructor(co) {
        this.text = co.text;
        this.callbackFn = co.callbackFn ? co.callbackFn : ()=>{};
        this.classes = co.classes ? co.classes : "";
        this.isSelected = co.isSelected ? co.isSelected : false;
    }
}