# choreo-byog-trigger

Choreo bring your own GitHub Repo Custom Action

#### Sample Usage

```
  name: "Create Branch on user repo",
  uses: "choreo-templates/choreo-byog-branch-create@v1.0.0",
  with: 
    token: "${{ env.APP_GH_TOKEN }}",
    org: "${{env.ORG_NAME}}",
    userRepoName: "${{env.APP_NAME}}",
    branch: "choreo-dev"
    headUserBranch: "master"
    username: "${{env.BB_USERNAME}}",
    gitProvider: "github"
```
