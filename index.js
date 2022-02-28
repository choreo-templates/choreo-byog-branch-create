const core = require('@actions/core');
const github = require('@actions/github');
const {GitHubService} = require("./github.service");
const defaultBranch = "main";

try {
    const token = core.getInput('token');
    const org = core.getInput('org');
    const userRepoName = core.getInput('userRepoName');
    const branch = core.getInput('branch');

    const githubService = new GitHubService(token, org, userRepoName)
    const isBranchExists = await githubService.isBranchExists(branch);

    if (isBranchExists) {
        console.log(`Branch ${branch} exists`);
        core.setOutput('branchExists', 'true');
    } else {
        console.log(`Branch ${branch} does not exist`);
        core.setOutput('branchExists', 'false');

        return await githubService.createBranch(branch, defaultBranch);
    }

} catch (e) {
    core.setOutput("choreo-status", "failed");
    core.setFailed(e.message);
    console.log("choreo-status", "failed");
    console.log(e.message);
}
