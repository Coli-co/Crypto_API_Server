const fetch = require('node-fetch')

const url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'

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
