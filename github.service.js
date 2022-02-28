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
        console.log(`Getting head branch: ${headBranch} sha`);
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
        console.log(`Head branch sha: ${sha}`);
        if (!sha) {
            throw new Error(`Head branch ${headBranch} does not exist in ${this.org}/${this.repo}`);
        }
        console.log(`Creating branch ${branch} with sha ${sha}`);

        try {
            const response = await this.octokit.request('POST /repos/{owner}/{repo}/git/refs', {
                owner: this.org,
                repo: this.repo,
                ref: `refs/heads/${branch}`,
                sha: sha
            });

            return response.status === 201;
        } catch (e) {
            console.log(`Branch ${branch} creation failed in ${this.org}/${this.repo}: [ERROR] ${e.message}`);
            throw e;
        }

    }
}

export {GitHubService};
