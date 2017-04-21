var nodegit = require('nodegit');
var fs = require('fs');
const execSync = require('child_process').execSync;
var GitUtils = require("../utils/GitUtils");

/********** PUBLIC ***********/
// Clones the repos in org to localReposPath
// Returns a promise that all repositories have been cloned successfully
function cloneRepos(org, token, localReposPath) {
	cleanRepoFolder(localReposPath);
	return new Promise(function(resolve, reject){
		GitUtils.getOrgRepos(org, token, function(repos) {
			var allPromises = [];
			repos.forEach(function(repo){
				allPromises.push(cloneRepo(localReposPath, repo.name, repo.clone_url));
			});
			Promise.all(allPromises).then(resolve).catch(reject);
		});
	});
}

module.exports = {
	cloneRepos:cloneRepos
}

/********** PRIVATE ***********/
// Helper method that clones a repo given the path, name, and clone url
// Returns a promise that the repo was cloned successfully
function cloneRepo(reposPath, name, url) {
	return new Promise(function(resolve, reject){
		nodegit.Clone(url, reposPath + "/" + name, {}).then(function(repo) {
			resolve("Successfully cloned " + name + ".");
		}).catch(function(err) {
			reject("Error cloning " + name + ".");
		});
	});
}

// Removes the repository folder, if it exists
function cleanRepoFolder(localReposPath) {
	try {
		fs.accessSync(localReposPath);
		try {
			execSync("rm -r '" + localReposPath + "'");
		} catch (e) {
			console.log("Problem removing repo folder. " + e);
		}
	} catch (e) {} // Folder doesn't exist
}

