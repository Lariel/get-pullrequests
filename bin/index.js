#! /usr/bin/env node
const https = require('https');
const pat=process.env.AZURE_PAT; //Token gerado no Azure > PAT _usersSettings/tokens
//console.log('AZURE_PAT: ',pat);
const token64=Buffer.from(':'+pat).toString('base64');
const { REPOS, ORGANIZATION, PROJECT } = require(`${process.env.FETCH_PR}/configs`);
const apiVersion='api-version=7.1-preview.1';
const baseUrl=`https://dev.azure.com/${ORGANIZATION}/${PROJECT}/_apis/git/pullrequests?${apiVersion}`;
//console.log('baseUrl: ',baseUrl);

const colVoteWidth = 8;
const colAuthorWidth = 20;
const colTitleWidth = 50;
const separator = '+'.padEnd(colVoteWidth+1, '-')
    .concat('+'.padEnd(colAuthorWidth+3, '-'))
    .concat('+'.padEnd(colTitleWidth+3, '-'))
    .concat('+'.padEnd(75,'-'));

const Votes = {
    '0':'NEW',
    '-5':'WA',
    '5':'OK-C',
    '10':'OK-NC'
}

const reposFilter = REPOS;

const options = {
    headers: {
        'Authorization': 'Basic '+token64,
        'Content-Type': 'application/json'
    }
};

getPullRequests();

function ellipsis(text, limit) {
    return text.length <= limit ? text : text.substring(0, limit-3).trim()+'...';
}

function formatResult(pr) {
    const vote = pr.reviewers[0] ? `|  ${Votes[pr.reviewers[0].vote]}`.padEnd(colVoteWidth, ' ') : `|  ${Votes[0]}`.padEnd(colVoteWidth, ' '); 
    const author = ` | ${ellipsis(pr.createdBy.displayName, colAuthorWidth).padEnd(colAuthorWidth, ' ')}`;
    const title = ` | ${ellipsis(pr.title, colTitleWidth).padEnd(colTitleWidth, ' ')}`;
    const url = ` | https://dev.azure.com/PUC-RS/PUCRS/_git/${pr.repository.name}/pullrequest/${pr.pullRequestId}`;
    console.log(`${vote}${author}${title}${url}`);
    //console.log(pr);
}

function displayResults(jsonBody) {

    const pullrequests = jsonBody.value
        .filter(pr => pr.isDraft == false)
        .filter(pr => reposFilter.includes(pr.repository.id))
        .sort((a,b) => a.pullRequestId - b.pullRequestId)
        .map(pr => formatResult(pr));
        
    console.log(separator);
    console.log(' Total: ', pullrequests.length);

}

function getPullRequests() {
    https.get(
        baseUrl,
        options, res => {
            let body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                const jsonBody = JSON.parse(body);
                //console.log('body: ', jsonBody);
                console.log(separator);
                const tableHead = '| STATUS'.padEnd(colVoteWidth, ' ').concat(' | AUTOR'.padEnd(colAuthorWidth+3, ' ')).concat(' | TITULO'.padEnd(colTitleWidth+3, ' ')).concat(' | LINK');
                console.log(tableHead);
                displayResults(jsonBody);
            });
        }
    );
}