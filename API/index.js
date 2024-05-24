const api = require("./gitHubApi")
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server is running");
});

app.get("/getReposInfo", async (req, res) => {
    try {
        const selectedRepos = req.query.repos || 5;
        const { data } = await api.get("orgs/takenet/repos?sort=created&direction=asc")
        const filteredArray = data.filter(repo => repo.language === "C#")
        while (filteredArray.length < selectedRepos) {
            let page = 2;
            const { data } = await api.get(`orgs/takenet/repos?sort=created&direction=asc&page=${page}`)
            page++;
            data.forEach(item => {
                if (item.language === "C#")
                    filteredArray.push(item)
            });
        }
        const oldestRepos = filteredArray.slice(0, selectedRepos);
        const allRepoData = {
            avatarUrl: oldestRepos[0].owner.avatar_url,
            repositories: []
        };
        oldestRepos.forEach(repo => {
            allRepoData.repositories.push({
                repoFullName: repo.full_name,
                repoDesc: repo.description,
            });
        })
        const objSuccess = {
            "result": allRepoData
        }
        res.status(200).send(objSuccess)
    }
    catch (err) {
        const objError = {
            "title": err.response.statusText,
            "detail": err.response.data.message,
            "status": err.response.status
        }
        res.status(err.response.status).send(objError)
    }
});

app.use((req, res, next) => {
    const objError = {
        "title": "Not found",
        "detail": "Error",
        "status": 404
    }
    res.status(404).send(objError)
})
