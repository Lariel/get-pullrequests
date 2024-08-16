const P_HELP = {
    values: ['-h','-help'],
    helpText: 'Shows this help'
};
const P_VERSION = {
    values: ['-v','-version'],
    helpText: 'Shows version information'
};
const P_DEBUG = {
    values: ['-debug'],
    helpText: 'Shows more information while running'
};

module.exports = {P_HELP, P_VERSION, P_DEBUG};