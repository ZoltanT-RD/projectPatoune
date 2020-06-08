const fs = require('fs');

const ah = require('../../helpers/AsyncHelper');
const mh = require('../../helpers/MathHelper');
const sh = require('../../helpers/StringHelper');

const axios = require('axios');

const fileDownloadAxiosOptions = (url) => {
    return {
        method: 'get',
        timeout: 10000, //10sec
        url: url,
        responseType: 'stream'
    }
};

const jsonDownloadAxiosOptions = (url) => {
    return {
        method: 'get',
        timeout: 10000, //10sec
        url: url
    }
};


async function tryDownload(axiosOptions, maxTries) {
    let currenTries = 1;
    let response;

    while (currenTries < maxTries && !response) {
        //console.log(`I'm trying for the ${currenTries} time; ${axiosOptions.url}`);

        try {
            response = await axios(axiosOptions);

        } catch (error) {
            console.log(`${currenTries} try failed`);
            currenTries++;
            await ah.sleep(mh.getRoundedExp(currenTries));
            //console.error(error);
        }
    }

    return response;
}



exports.downloadImage = async function (url, targetPath, maxTries = 5) {

    let response = await tryDownload(fileDownloadAxiosOptions(url), maxTries);

    if (response) {
        response.data.pipe(fs.createWriteStream(targetPath));
        return Promise.resolve("image donwloaded");
    }
    else {
        console.log(`I've tried ${maxTries} times, yet the API says NO! -_-"`);
        return Promise.reject(`I've tried ${maxTries} times, yet the API says NO! -_-"`);
    }
};

exports.getJSON = async function (url, maxTries = 5) {
    let response = await tryDownload(jsonDownloadAxiosOptions(url), maxTries);

    if (response) {
        //sh.yout(response.data);
        return Promise.resolve(response.data);
    }
    else {
        console.log(`I've tried ${maxTries} times, yet the API says NO! -_-"`);
        return Promise.reject(`I've tried ${maxTries} times, yet the API says NO! -_-"`);
    }
}

exports.getHTML = async function (url, maxTries = 5) {
    let response = await tryDownload(jsonDownloadAxiosOptions(url), maxTries);

    if (response) {
        //sh.yout(response.data);
        return Promise.resolve(response.data);
    }
    else {
        //sh.yout(response);
        console.log(`I've tried ${maxTries} times, yet the API says NO! -_-"`);
        return Promise.reject(`I've tried ${maxTries} times, yet the API says NO! -_-"`);
    }
}