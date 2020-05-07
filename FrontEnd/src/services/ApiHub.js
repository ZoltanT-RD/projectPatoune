import apiHelper from './ApiHelper';
import apiconfig from './apiconfig';

class ApiHub {

    static getTest() {
        return apiHelper.get(`${apiconfig.serverBaseURL}/testData`).then(resp => resp);//(response => response.data);
    }

    static getTemplateList(){
        return apiHelper.get(`${apiconfig.serverBaseURL}/getTemplateList`).then(resp => resp);
    }

    static getTemplate(params){
        return apiHelper.get(`${apiconfig.serverBaseURL}/getTemplate?id=${params.id}`).then(resp => resp);
    }

    /*
    updateCustomer(customerDto) {
        return apiHelper.putJSON(`/api/Customer/${customerDto.id}`, JSON.stringify(customerDto)).then(response => response.data);
    }

    getCountryCodes() {
        return apiHelper.get(`/api/Country?phoneCode=`).then(response => response.data);
    }
    */
}
export default ApiHub;