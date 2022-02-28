import * as core from '@actions/core';
import {GitHubService} from "./github.service.js";
const defaultBranch = "main";

try {
    const token = core.getInput('token');
    const org = core.getInput('org');
    const userRepoName = core.getInput('userRepoName');
    const branch = core.getInput('branch');

    const githubService = new GitHubService(token, org, userRepoName)
    let isBranchExists;
    githubService.isBranchExists(branch).then(res => {
        isBranchExists = res;
        if (!isBranchExists) {
            console.log(`Branch ${branch} does not exist`);
            core.setOutput('branchExists', 'false');

            githubService.createBranch(branch, defaultBranch).then(res => {
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
