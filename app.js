const API_URL = 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=RUB%3DX%2C%20KGS%3DX'

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
let today = new Date().toLocaleDateString()
let arrOfNum = []


fields.forEach((i) => i.addEventListener('keypress', (event) => {
  if (i.value.length > 4) {
    event.preventDefault()
    return false
  }
}))


let RUB = window.localStorage.getItem('rub')
let KGS = window.localStorage.getItem('kgs')
document.querySelector('.rub').innerText = `${RUB}` || 'loading...'


if (!localStorage.today || today !== localStorage.today) {
  window.localStorage.setItem('today', today)
  fetchCurrency()
}

// listiners

input.addEventListener('keyup', () => {
  if (!RUB || !KGS) {
    RUB = localStorage.rub
    KGS = localStorage.kgs
  }
  const diff = (101 + +KGS * 1.015 - +RUB) / 100
  let val = Math.ceil(diff * input.value)

  if (!input.value) output.value = ''
  if (input.value > 0) output.value = val + (val > 5000 ? Math.ceil(val * 0.01) : 50)
  if (arrOfNum.length && !input.value) {
    let v = calcDiff(diff, sumFn(arrOfNum))
    output.value = v + (v > 5000 ? Math.ceil(v * 0.01) : 50)
  }

})

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') createArrOfCalc(input.value)
})

plus.addEventListener('click', () => {
  createArrOfCalc(input.value)
})

arrow.addEventListener('pointerdown', () => {
  arrOfNum.length = 0
  arrow.innerText = '↓'
  output.value = ''
})

arrow.addEventListener('pointerover', () => {
  if (arrOfNum.length) setTimeout(() => arrow.innerText = 'удалить сохраненные значения?', 400)
})

arrow.addEventListener('pointerleave', () => {
  if (arrOfNum.length)
    setTimeout(() => arrow.innerText = `${arrOfNum.toString().replace(/,/g, ' + ')}`, 400)
})

document.addEventListener('keydown', (e) => {
  if (e.key == "Escape") clearAll()
})



//helpers

function createArrOfCalc(val) {
  if (!val) return
  arrOfNum.push(val)
  arrow.innerText = `${arrOfNum.toString().replace(/,/g, ' ')}`
  input.value = ''
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

function calcDiff(diff, value) {
  return Math.ceil(diff * value)
}

function clearAll() {
  arrOfNum.length = 0
  arrow.innerText = '↓'
  output.value = ''
}