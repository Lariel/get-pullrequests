#! /usr/bin/env node
const https = require('https');
const versionInfo = require('../package').version;
const { P_HELP, P_VERSION, P_DEBUG } = require('./params');
const { AZURE_PAT, REPOS, ORGANIZATION, PROJECT, REVIEWER } = require(`${process.env.FETCH_PR}/configs`);
const paramsList = process.argv.slice(2);
const apiVersion='api-version=7.1-preview.1';
const baseUrl=`https://dev.azure.com/${ORGANIZATION}/${PROJECT}`;
const INVALID_PARAMS = `Invalid params.`;

const colVoteWidth = 11;
const colAuthorWidth = 20;
const colBranchSourceWidth = 40;
const colBranchTargetWidth = 20;
const colTitleWidth = 50;
const separator = '+'.padEnd(colVoteWidth+1, '-')
    .concat('+'.padEnd(colAuthorWidth+3, '-'))
    .concat('+'.padEnd(colBranchSourceWidth+3, '-'))
    .concat('+'.padEnd(colBranchTargetWidth+3, '-'))
    .concat('+'.padEnd(colTitleWidth+3, '-'))
    .concat('+'.padEnd(80,'-'));

const Votes = {
    '-10':'RE',
    '-5':'WA',
    '0':'NEW',
    '5':'OK-NC',
    '10':'ACTIVE'
}

const pat = AZURE_PAT;
const token64=Buffer.from(':'+pat).toString('base64');

const reposFilter = REPOS;

const options = {
    headers: {
        'Authorization': 'Basic '+token64,
        'Content-Type': 'application/json'
    }
};

let helpParam;
let versionParam;
let debugParam;

handleParams(paramsList);

function ellipsis(text, limit) {
    return text.length <= limit ? text : text.substring(0, limit-3).trim()+'...';
}

function formatBranchName(branchFullName) {
    return branchFullName.substring(11);
}

function formatResult(pr) {
    if (debugParam){
        console.log(pr);
    } else {
        const vote = pr.reviewers[0] ? `|  ${Votes[pr.reviewers[0].vote]}`.padEnd(colVoteWidth, ' ') : `|  ${Votes[0]}`.padEnd(colVoteWidth, ' '); 
        const author = ` | ${ellipsis(pr.createdBy.displayName, colAuthorWidth).padEnd(colAuthorWidth, ' ')}`;
        const sourceBranch = ` | ${ellipsis(formatBranchName(pr.sourceRefName), colBranchSourceWidth).padEnd(colBranchSourceWidth, ' ')}`;
        const targetBranch = ` | ${ellipsis(formatBranchName(pr.targetRefName), colBranchTargetWidth).padEnd(colBranchTargetWidth, ' ')}`;
        const title = ` | ${ellipsis(pr.title, colTitleWidth).padEnd(colTitleWidth, ' ')}`;
        const url = ` | ${baseUrl}/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}`;
        console.log(`${vote}${author}${sourceBranch}${targetBranch}${title}${url}`);
    }
}

function filterPullRequest(pullRequest) {

    return pullRequest.isDraft == false && (
        reposFilter.includes(pullRequest.repository.id) || 
        reposFilter.includes(pullRequest.repository.name) ||
        pullRequest.reviewers.some(reviewer => reviewer.displayName.includes(REVIEWER))
    );
}

function displayResults(jsonBody) {

    const pullrequests = jsonBody.value
        .filter(pr => filterPullRequest(pr))
        .sort((a,b) => a.pullRequestId - b.pullRequestId)
        .map(pr => formatResult(pr));
        
    console.log(separator);
    console.log(' Total: ', pullrequests.length);

}

function getPullRequests() {
    https.get(
        `${baseUrl}/_apis/git/pullrequests?${apiVersion}`,
        options, res => {
            let body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                const jsonBody = JSON.parse(body);
                //console.log('body: ', jsonBody);
                console.log(separator);
                const tableHead = '| STATUS'.padEnd(colVoteWidth, ' ')
                    .concat(' | AUTOR'.padEnd(colAuthorWidth+3, ' '))
                    .concat(' | ORIGEM'.padEnd(colBranchSourceWidth+3, ' '))
                    .concat(' | DESTINO'.padEnd(colBranchTargetWidth+3, ' '))
                    .concat(' | TITULO'.padEnd(colTitleWidth+3, ' '))
                    .concat(' | LINK');
                console.log(tableHead);
                displayResults(jsonBody);
            });
        }
    );
}

function handleHelpParam(param) {

    const HELP_TEXT = `
    ----------------------------------------------------------------------------------------
    |   Help:                                                                                                         
    |       Usage:                                                                                                    
    |           $ fetch-pullrequests
    |                                                                                                                 
    |           Options:                                                                                              
    |               ${P_HELP.values}             ${P_HELP.helpText}                                               
    |               ${P_VERSION.values}          ${P_VERSION.helpText}                       
    |               ${P_DEBUG.values}               ${P_DEBUG.helpText}                        
    |                                                                                                                 
    |      Configs found:                                                                                             
    |           Repos: ${reposFilter.length}                                                                                       
    |           Revisor: ${REVIEWER ? REVIEWER : 'Não configurado no arquivo'} ${process.env.FETCH_PR}/configs.js
    |                                                                                                                 
    |                                                                                                                 
    ----------------------------------------------------------------------------------------
    `

    const doHelp = () => {
        helpParam = true;
        console.log(HELP_TEXT);
    }

    P_HELP.values.includes(param) ? doHelp() : null;
}

function handleVersionParam(param) {

    const showVersion = () => {
        versionParam = true;
        console.log(` Version: ${versionInfo}`);
    }

    P_VERSION.values.includes(param) ? showVersion() : null;
}

function handleDebugParam(param) {

    const activeDebug = () => {
        debugParam = true;
        console.log(' Debug mode active!');
        console.log(` Repos: ${reposFilter.length}`);
        console.log(` Revisor: ${REVIEWER}`);
    }

    P_DEBUG.values.includes(param) ? activeDebug() : null;
}

function handleParams(paramsList) {
    
    paramsList.forEach(param => {
        handleHelpParam(param);
        handleVersionParam(param);
        handleDebugParam(param);
    });

    if (helpParam || versionParam) {
        return;
    }

    getPullRequests();

}