import {Octokit} from "@octokit/core";

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
        console.log(`Checking if branch ${branch} exists in ${this.org}/${this.repo}`);
        try {
            const response = await this.octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
                owner: this.org,
                repo: this.repo,
                branch: branch
            });

            return response.status === 200;
        } catch (e) {
            console.log(`Branch ${branch} does not exist in ${this.org}/${this.repo}`);
            return false;
        }
    }

    async createBranch(branch, headBranch = "main") {
        console.log(`Creating branch ${branch} in ${this.org}/${this.repo}`);
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
