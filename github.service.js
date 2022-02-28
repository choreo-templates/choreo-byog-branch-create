const {Octokit} = require("@octokit/core");

interface GitHubRefRes {
    ref: string;
    node_id: string;
    url: string;
    object: {
        sha: string;
        type: string;
        url: string;
    };
}

export class GitHubService {
    private token: string;
    private org: string;
    private repo: string;
    private octokit: Octokit;

    constructor(authToken: string, org: string, repo: string) {
        this.authToken = authToken;
        this.octokit = new Octokit({
            auth: this.authToken
        });
    }

    async isBranchExists(branch: string): Promise<boolean> {
        const response = await this.octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
            owner: this.org,
            repo: this.repo,
            branch: branch
        });

        return response.status === 200;
    }

    async createBranch(branch: string, headBranch: string = "main"): Promise<void> {
        const referenceRes = await this.octokit.request(
            "GET /repos/{owner}/{repo}/git/ref/{ref}",
            {
                owner: this.org,
                repo: this.repo,
                ref: `heads/${headBranch}`,
            }
        );
        const ref: GitHubRefRes = referenceRes.data;
        const sha = ref.object.sha;

        const response = await this.octokit.request('POST /repos/{owner}/{repo}/git/refs', {
            owner: this.org,
            repo: this.repo,
            ref: `refs/heads/${branch}`,
            sha: sha
        });

        return response.status === 201;
    }
}
