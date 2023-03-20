require('dotenv').config()
const fetch = require('node-fetch')

const url = process.env.DATA_URL
function fetchData() {
  return fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((jsonData) => {
      return jsonData
    })
    .catch((err) => console.log('fetch err:', err))
}

module.exports = { fetchData }
