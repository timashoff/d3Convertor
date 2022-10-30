const API_URL = 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=RUB%3DX%2C%20KGS%3DX'
const input = document.querySelectorAll('input')
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '399d80f1a0msh291d45f0a5595c3p1f4701jsn2250c1094799',
    'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
  }
}
input.forEach(i => i.addEventListener('keypress', (event) => {
  if (i.value.length > 4) {
    event.preventDefault()
    return false
  }
}))

async function currency() {
  const res = await fetch(API_URL, options)
  const data = await res.json()
  const RUB = data.quoteResponse.result[0].bid
  const KGS = data.quoteResponse.result[1].bid
  input[0].addEventListener('keyup', () => {
    let diff = (101 + KGS - RUB) / 100
    let val = Math.ceil(diff * input[0].value)
    if (input[0].value.length > 5) return false
    if (!input[0].value) input[1].value = ''
    if (input[0].value > 0) input[1].value = val + (val > 5000 ? Math.ceil(val * 0.01) : 50)
  })
}
currency()
