/**
 * @author Zoltan Tompa
 * @email zoltan@resdiary.com
 * @create date 2019-01-04 11:10:44
 * @modify date 2019-01-04 11:10:44
 * @desc [description]
 */


const consoleChattynessRule = {
    debugAndAbove: 0,
    infoAndAbove: 1,
    warnAndAbove: 2,
    onlyErrors: 3
};

let consoleChattyness = consoleChattynessRule.infoAndAbove;

const emoticons = {
    '*\\(^o^)/*': '*\\(^o^)/*',
    'p(^_^)q': 'p(^_^)q',
    '(^_^)': '(^_^)',
    '(^-^)': '(^-^)',
    '(^o^)': '(^o^)',
    '(^ v ^)': '(^ v ^)',
    '(@^_^@)': '(@^_^@)',
    '(^_*)': '(^_*)',
    '(@^o^@)': '(@^o^@)',
    '(o_O)': '(o_O)',
    '(0_0)': '(0_0)',
    "(-_-')": "(-_-')",
    "(-,,-)": "(-,,-)",
    '=]': '=]',
    'whaleOut': '        \n' +
        '          .     ' + '\n' +
        '         ":"    ' + '\n' +
        '       ___:____     |"\/"|' + '\n' +
        "     ,'        `.    \  /" + '\n' +
        '     |  O        \___/  |' + '\n' +
        '   ~^~^~^~^~^~^~^~^~^~^~^~^~  (logo: Riitta Rasimus)' + '\n' +
        ' PROJECT PATOUNE BOOK-COVER API ' + '\n',

    'whaleIn': '        \n' +
        '\n        '
        + '\n' + '                      .          '
        + '\n' + '                     ":"         '
        + '\n' + '      |"\/"|     ____:___       '
        + '\n' + "       \  /    .`        ',     "
        + '\n' + '        | \___/        O  |     '
        + '\n' + '    ~^~^~^~^~^~^~^~^~^~^~^~^~   (logo: Riitta Rasimus)'
        + '\n' + '  PROJECT PATOUNE BOOK-COVER API '
        + '\n'

    //  *\(^o^)/*  p(^_^)q  (^_^)   (^-^)   (^o^)   (^ v ^)   (@^_^@)   (^_*)   (@^o^@)
};

const text = {
    hello: `Hello there! ${emoticons["=]"]} Welcome to the cover-store API! ${emoticons["(^_^)"]}`,
    onlyGet: 'Only GET requests are allowed, sorry.... (not really ' + emoticons["(^ v ^)"] + ' )',
    badRequest: 'not sure what you mean by this request ' + emoticons["(0_0)"] + ' ...',
    me: 'I am the cover-store API! ' + emoticons["(@^_^@)"],
    xNotImplemented: (x = "this feature") => {
        return `${x} is NOT implemented yet! ${emoticons["p(^_^)q"]}`;
    },
    xIsInvalid: (x = "this") => {
        return `${x} is invalid ${emoticons["(-_-')"]} ...`;
    },
    emptyLine: ''
};

const toConsole = {
    out: (msg = "") => {
        if (typeof msg === "object") {
            msg = JSON.stringify(msg);
        };
        console.log(`${msg}`);
    },
    debug: (msg = "",moduleName = "UNKNOWN") => {
        if (consoleChattyness === consoleChattynessRule.debugAndAbove) {
            if (typeof msg === "object") {
                msg = JSON.stringify(msg);
            };
            writeToConsole(`[${(new Date()).toISOString()}] ${moduleName}Module: ${msg}`, true);
            //console.log(`[${(new Date()).toISOString()}] ${moduleName}Module: ${msg}`);
        }
    },
    info: (msg = "",moduleName = "UNKNOWN") => {
        if (consoleChattyness === consoleChattynessRule.debugAndAbove ||
            consoleChattyness === consoleChattynessRule.infoAndAbove) {
            if (typeof msg === "object") {
                msg = JSON.stringify(msg);
            };
            writeToConsole(`[${(new Date()).toISOString()}] ${moduleName}Module: ${msg}`);
            //console.log(`[${(new Date()).toISOString()}] ${moduleName}Module: ${msg}`);
        }
    },
    warn: (msg = "",moduleName = "UNKNOWN") => {
        if (consoleChattyness === consoleChattynessRule.debugAndAbove ||
            consoleChattyness === consoleChattynessRule.infoAndAbove ||
            consoleChattyness === consoleChattynessRule.warnAndAbove) {
            if (typeof msg === "object") {
                msg = JSON.stringify(msg);
            };
            writeToConsole(`[${(new Date()).toISOString()}] ${moduleName}Module [warn]: ${msg}`);
            //console.log(`[${(new Date()).toISOString()}] ${moduleName}Module [warn]: ${msg}`);
        }
    },
    error: (msg = "",moduleName = "UNKNOWN") => {
        if (consoleChattyness === consoleChattynessRule.debugAndAbove ||
            consoleChattyness === consoleChattynessRule.infoAndAbove ||
            consoleChattyness === consoleChattynessRule.warnAndAbove ||
            consoleChattyness === consoleChattynessRule.onlyErrors) {
            if (typeof msg === "object") {
                msg = JSON.stringify(msg);
            };
            writeToConsole(`[${(new Date()).toISOString()}] ${moduleName}Module [ERROR]: ${msg}`, true);
            //console.log(`[${(new Date()).toISOString()}] ${moduleName}Module [ERROR]: ${msg}`);
        }
    }
};

const writeToConsole = function (msg = "", doFullStack = false) {
    if (msg === "") {
        return;
    }
    else if (doFullStack) {
        console.log((new Error(msg)).toString().substring(7));
    }
    else {
        let c = new Error(msg).stack.split('\n');
        let d = c[0].replace("Error: ", "") + " -- " + c[4].substring(4, c[4].indexOf("(") - 1) + "()";
        console.log(d);
    }
}

function setConsoleChattyness(cChattyness = consoleChattynessRule.infoAndAbove){
    consoleChattyness = cChattyness;
}

module.exports = {
    setConsoleChattyness: setConsoleChattyness,
    consoleChattynessRule: consoleChattynessRule,
    emoticons: emoticons,
    text: text,
    toConsole: toConsole
}