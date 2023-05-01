import * as core from '@actions/core';
import {GitHubService} from "./github.service.js";
import {BitbucketService} from "./bitbucket.service.js";

try {
    const headUserBranch = core.getInput('headBranch') || "main";
    const gitProvider = core.getInput('gitProvider') || "github";
    const username = core.getInput('username');
    const token = core.getInput('token');
    const org = core.getInput('org');
    const userRepoName = core.getInput('userRepoName');
    const branch = core.getInput('branch');

    let gitHubService;
    if (gitProvider == "github") {
        githubService = new GitHubService(token, org, userRepoName)
    } else if (gitProvider == "bitbucket") {
        githubService = new BitbucketService(token, username, org, userRepoName)
    } else {
        core.setOutput("choreo-status", "failed");
        core.setFailed("Invalid git provider");
        console.log("choreo-status", "failed");
        console.log("Invalid git provider");
    }
    
    githubService.isBranchExists(branch).then(res => {
        isBranchExists = res;
        if (!isBranchExists) {
            console.log(`Branch ${branch} does not exist`);
            core.setOutput('branchExists', 'false');

            githubService.createBranch(branch, headUserBranch).then(res => {
                console.log(`Branch ${branch} created`);
                core.setOutput('branchCreated', 'true');
            }).catch(e => {
                console.log(`Branch ${branch} creation failed : ${e}`);
                core.setOutput('branchExists', 'false');
                throw e;
            });
        } else {
            console.log(`Branch ${branch} exists`);
            core.setOutput('branchExists', 'true');
        }
    }).catch(e => {
        console.log(`Branch ${branch} check failed : ${e}`);
        core.setOutput('branchCheck', 'false');
        throw e;
    });


} catch (e) {
    core.setOutput("choreo-status", "failed");
    core.setFailed(e.message);
    console.log("choreo-status", "failed");
    console.log(e.message);
}
