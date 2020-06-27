const env = require('../../_env');
import apiHelper from './ApiHelper';


class ApiHub {

    static serverBase () {
        return `${env.WebServerBaseURL}:${env.WebServerPort}/api`
    };

    static getTest() {
        return apiHelper.get(`${this.serverBase()}/simpleTest`).then(resp => resp);//(response => response.data);
    }

    static getTemplateList(){
        return apiHelper.get(`${this.serverBase()}/getTemplateList`).then(resp => resp);
    }

    static getTemplate(params){
        return apiHelper.get(`${this.serverBase()}/getTemplate?id=${params.id}`).then(resp => resp);
    }

    /*
    updateCustomer(customerDto) {
        return apiHelper.putJSON(`/api/Customer/${customerDto.id}`, JSON.stringify(customerDto)).then(response => response.data);
    }

    getCountryCodes() {
        return apiHelper.get(`/api/Country?phoneCode=`).then(response => response.data);
    }
    */

    static getBookCover(bookID){
        return apiHelper.getImage(`${this.serverBase()}/bookCover/${bookID}`);
    }

    ///fixme "unconfirmed" here is for testing
    static getLibraryPageData(from = 0, count = 10, bookStatusFilterArray = ["unconfirmed"]) {
        const options = `itemsFrom=${from}&itemLimit=${count}&${bookStatusFilterArray.join("&")}`;
        return apiHelper.get(`${this.serverBase()}/db/pages/library?${options}`);
    }


}
export default ApiHub;