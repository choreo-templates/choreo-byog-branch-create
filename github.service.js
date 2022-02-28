const {Octokit} = require("@octokit/core");

class GitHubService {
    constructor(authToken, org, repo) {
        this.authToken = authToken;
        this.org = org;
        this.repo = repo;
        this.octokit = new Octokit({
            auth: this.authToken
        });
    }

    async isBranchExists(branch) {
        const response = await this.octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
            owner: this.org,
            repo: this.repo,
            branch: branch
        });

        return response.status === 200;
    }

    async createBranch(branch, headBranch = "main") {
        const referenceRes = await this.octokit.request(
            "GET /repos/{owner}/{repo}/git/ref/{ref}",
            {
                owner: this.org,
                repo: this.repo,
                ref: `heads/${headBranch}`,
            }
        );
        const ref = referenceRes?.data;
        const sha = ref?.object?.sha;

        const response = await this.octokit.request('POST /repos/{owner}/{repo}/git/refs', {
            owner: this.org,
            repo: this.repo,
            ref: `refs/heads/${branch}`,
            sha: sha
        });

        return response.status === 201;
    }
}

export {GitHubService};
