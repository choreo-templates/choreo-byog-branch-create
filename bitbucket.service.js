import axios from 'axios';

class BitbucketService {

    constructor(authToken, username, org, repo) {
        this.authToken = authToken;
        this.username = username;
        this.repo = repo;
        this.org = org;
    }

    async isBranchExists(branch) {
        console.log(`Checking if branch ${branch} exists in ${this.org}/${this.repo}`);
        try {

            // get branch from bitbucket using axios construct the auth header with username and authtoken as basic auth
            const response = await axios.get(`https://api.bitbucket.org/2.0/repositories/${this.org}/${this.repo}/refs/branches/${branch}`, {
                auth: {
                    username: this.username,
                    password: this.authToken
                }
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
        const referenceRes = await axios.get(`https://api.bitbucket.org/2.0/repositories/${this.org}/${this.repo}/refs/branches/${headBranch}`, {
            auth: {
                username: this.username,
                password: this.authToken
            }
        });
        const ref = referenceRes?.data;
        const sha = ref?.target?.hash;
        console.log(`Head branch sha: ${sha}`);
        if (!sha) {
            throw new Error(`Head branch ${headBranch} does not exist in ${this.org}/${this.repo}`);
        }
        console.log(`Creating branch ${branch} with sha ${sha}`);

        try {
            const response = await axios.post(`https://api.bitbucket.org/2.0/repositories/${this.org}/${this.repo}/refs/branches`, {
                name: branch,
                target: {
                    hash: sha
                }
            }, {
                auth: {
                    username: this.username,
                    password: this.authToken
                }
            });

            return response.status === 201;
        } catch (e) {
            console.log(`Branch ${branch} creation failed in ${this.org}/${this.repo}: [ERROR] ${e.message}`);
            throw e;
        }
    }
}

export {BitbucketService};
