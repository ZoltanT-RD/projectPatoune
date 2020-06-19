import axios from 'axios';


class ApiHelper {

    static get(url, timeout = 0) {
        return axios.get(url, { timeout: timeout });
    }

    static getImage(url, timeout = 0) {
        return axios.get(url, { timeout: timeout, responseType: 'arraybuffer' })
            .then(res => {
                return `data:image/png;base64,${btoa(
                    new Uint8Array(res.data).reduce(
                        (dataArray, byte) => {
                            return dataArray + String.fromCharCode(byte);
                        },
                        ''
                    )
                )}`
            });
    }

    static post(url, body, headers, timeout = 0) {
        return axios.post(url, body, { "headers": headers, timeout: timeout });
    }

    static postJSON(url, body, timeout = 0) {
        return this.post(url, body, { 'Content-Type': 'application/json' }, timeout);
    }

    static put(url, body, headers, timeout = 0) {
        return axios.put(url, body, { "headers": headers, timeout: timeout });
    }

    static putJSON(url, body, timeout = 0) {
        return this.put(url, body, { 'Content-Type': 'application/json' }, timeout);
    }

    static deleteRequest(url, timeout = 0) {
        return axios.delete(url, { timeout: timeout });
    }

    static isApiCallSucessfull(status, statusText) {
        if (status !== 200 || statusText !== "OK") {
            return false;
        }
        return true;
    }
}
export default ApiHelper;