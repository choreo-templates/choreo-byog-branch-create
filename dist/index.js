/******/ var __webpack_modules__ = ({

/***/ 838:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 335:
/***/ ((module) => {

module.exports = eval("require")("@octokit/core");


/***/ }),

/***/ 952:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ../../../../../opt/homebrew/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/core
var core = __nccwpck_require__(838);
// EXTERNAL MODULE: ../../../../../opt/homebrew/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@octokit/core
var _notfound_octokit_core = __nccwpck_require__(335);
;// CONCATENATED MODULE: ./github.service.js


class GitHubService {
    constructor(authToken, org, repo) {
        this.authToken = authToken;
        this.org = org;
        this.repo = repo;
        this.octokit = new _notfound_octokit_core.Octokit({
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



// EXTERNAL MODULE: ../../../../../opt/homebrew/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?axios
var _notfoundaxios = __nccwpck_require__(952);
;// CONCATENATED MODULE: ./bitbucket.service.js


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
            const response = await _notfoundaxios.get(`https://api.bitbucket.org/2.0/repositories/${this.org}/${this.repo}/refs/branches/${branch}`, {
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
        const referenceRes = await _notfoundaxios.get(`https://api.bitbucket.org/2.0/repositories/${this.org}/${this.repo}/refs/branches/${headBranch}`, {
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
            const response = await _notfoundaxios.post(`https://api.bitbucket.org/2.0/repositories/${this.org}/${this.repo}/refs/branches`, {
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



;// CONCATENATED MODULE: ./index.js




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

})();

