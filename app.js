const API_URL = 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=RUB%3DX%2C%20KGS%3DX'
const usdBlizzRate = 55
const bankPercent = 2.6
const koronaPercent = 10
const convertPercent = bankPercent + koronaPercent
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'f2f559f13cmsh4cad7d6008499e4p17df63jsn1ee918e3b228',
    'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
  }
}
const fields = document.querySelectorAll('input')
const input = document.getElementById('input')
const output = document.getElementById('output')
const plus = document.getElementById('plus')
const arrow = document.querySelector('.arrow')
const date = document.querySelector('.today')
let today = new Date().toLocaleDateString('ru', { hour: 'numeric' })
let arrOfNum = []
let total = 0

fields.forEach((i) => i.addEventListener('keypress', (event) => {
  if (i.value.length > 4) {
    event.preventDefault()
    return false
  }
}))

let RUB = window.localStorage.getItem('rub')
let KGS = window.localStorage.getItem('kgs')
document.querySelector('.rub').innerText = `${RUB}` || 'loading...'

checkDate()


// listiners

input.addEventListener('keyup', () => {
  calculate()
})
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') totalFN()

})

plus.addEventListener('click', totalFN)

arrow.addEventListener('pointerdown', clearAll)
arrow.addEventListener('pointerover', () => {
  if (arrOfNum.length) setTimeout(() => arrow.innerText = 'удаление всех значений', 400)
})
arrow.addEventListener('pointerleave', () => {
  if (arrOfNum.length)
    setTimeout(() => arrow.innerText = `${arrOfNum.toString().replace(/,/g, ' + ')}`, 400)
})

document.addEventListener('keydown', (e) => {
  if (e.key == "Escape") clearAll()
})


//helpers

function totalFN() {
  if (input.value < 1) return
  arrOfNum.push(+input.value)
  arrow.innerText = `${arrOfNum.toString().replace(/,/g, ' ')}`
  input.value = ''
  total = +output.value
  if (arrOfNum.length > 1 && total > 5000) updTotal()
  output.value = total
}

async function fetchCurrency() {
  const res = await fetch(API_URL, options)
  const data = await res.json()
  window.localStorage.setItem('rub', data.quoteResponse.result[0].ask)
  window.localStorage.setItem('kgs', data.quoteResponse.result[1].ask)
  document.querySelector('.rub').innerText = `${data.quoteResponse.result[0].ask}`
  console.log(data)
}

function sumFn(arr) {
  return arr.reduce((acc, i) => +acc + +i)
}

function clearAll() {
  arrOfNum.length = 0
  arrow.innerText = '↓'
  output.value = ''
  input.value = ''
}

function checkDate() {
  if (today !== localStorage.today) {
    window.localStorage.setItem('today', today)
    fetchCurrency()
  }
}

function calculate() {
  checkDate()
  if (!RUB) RUB = localStorage.rub
  const diff = Math.round(RUB / usdBlizzRate * 101) - 100
  if (!input.value && !arrOfNum.length) output.value = ''
  if (input.value < 1) return
  const val = Math.round(input.value * ((diff + convertPercent) / 101 + 1))
  if (!arrOfNum.length) output.value = val + (val > 5000 ? Math.ceil(val * 0.01) : 50)
  if (arrOfNum.length) output.value = +total + val
}

function updTotal() {
  console.log(total, 'Суммы свыше 5000!')
  const diff = Math.round(RUB / usdBlizzRate * 101) - 100
  const sum = sumFn(arrOfNum)
  const val = Math.round(sum * ((diff + convertPercent) / 101 + 1))
  total = val + Math.ceil(val * 0.01)
}

date.innerText = `${localStorage.today}`
// date.innerText = `${localStorage.today.toString().slice(0, 10)}`