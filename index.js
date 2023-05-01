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

    if (gitProvider == "github") {
        const githubService = new GitHubService(token, org, userRepoName);
        githubService.isBranchExists(branch).then(res => {
            let isBranchExists = res;
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
    } else if (gitProvider == "bitbucket") {
        console.log("bitbucket")
        const bitbucketService = new BitbucketService(token, username, org, userRepoName)
        bitbucketService.isBranchExists(branch).then(res => {
            let isBranchExists = res;
            if (!isBranchExists) {
                console.log(`Branch ${branch} does not exist`);
                core.setOutput('branchExists', 'false');

                bitbucketService.createBranch(branch, headUserBranch).then(res => {
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
    } else {
        core.setOutput("choreo-status", "failed");
        core.setFailed("Invalid git provider");
        console.log("choreo-status", "failed");
        console.log("Invalid git provider");
    }

} catch (e) {
    core.setOutput("choreo-status", "failed");
    core.setFailed(e.message);
    console.log("choreo-status", "failed");
    console.log(e.message);
}
