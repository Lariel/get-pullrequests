const P_HELP = {
    values: ['-h','-help'],
    helpText: 'Show this help',
    type: 'boolean'
};
const P_VERSION = {
    values: ['-v','-version'],
    helpText: 'Show version information',
    type: 'boolean'
};
const P_DEBUG = {
    values: ['-debug'],
    helpText: 'Shows more information while running',
    type: 'boolean'
};

module.exports = {P_HELP, P_VERSION, P_DEBUG};