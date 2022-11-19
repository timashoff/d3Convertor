const API_URL = 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=RUB%3DX%2C%20KGS%3DX'
const input = document.querySelectorAll('input')
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'f2f559f13cmsh4cad7d6008499e4p17df63jsn1ee918e3b228',
    'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
  }
}

input.forEach(i => i.addEventListener('keypress', (event) => {
  if (i.value.length > 4) {
    event.preventDefault()
    return false
  }
}))
let RUB = window.localStorage.getItem('rub')
let KGS = window.localStorage.getItem('kgs')
document.querySelector('.rub').innerText = `${RUB}`

let today = new Date().toLocaleDateString()

if (!window.localStorage.getItem('today')) {
  window.localStorage.setItem('today', today)
  fetchCurrency()

}

if (new Date().toLocaleDateString() !== today) {
  window.localStorage.setItem('today', today)
  fetchCurrency()
}


input[0].addEventListener('keyup', () => {
  if (!RUB || !KGS) {
    RUB = window.localStorage.getItem('rub')
    KGS = window.localStorage.getItem('kgs')
  }
  let diff = (101 + +KGS - +RUB) / 100
  let val = Math.ceil(diff * input[0].value)
  if (!input[0].value) input[1].value = ''
  if (input[0].value > 0) input[1].value = val + (val > 5000 ? Math.ceil(val * 0.01) : 50)
})


async function fetchCurrency() {
  const res = await fetch(API_URL, options)
  const data = await res.json()
  window.localStorage.setItem('rub', data.quoteResponse.result[0].bid)
  window.localStorage.setItem('kgs', data.quoteResponse.result[1].bid)
  document.querySelector('.rub').innerText = `${data.quoteResponse.result[0].bid}`
}


