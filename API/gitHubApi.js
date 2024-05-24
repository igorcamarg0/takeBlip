const axios = require('axios');
const api = axios.create({
    baseURL:"https://api.github.com/",
});
api.defaults.headers.common['Authorization']=`token INSIRA SEU TOKEN DO GITHUB API AQUI`

module.exports = api;