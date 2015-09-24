log = a => console.log(a)

randomString = () => Math.random().toString(36).slice(-8)

range = (low, high) => {
  let arr = []
    , counter = high - low + 1

  while (counter--) {
    arr[counter] = high--
  }
  return arr
}

// knuth shuffle

shuffle = array => {
  let currentIndex = array.length
    , temporaryValue
    , randomIndex

  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

// star rating

weirdInvert = n => {
  switch (n) {
    case '1':
      return 9
    case '2':
      return 7
    case '3':
      return 5
    case '4':
      return 3
    case '5':
      return 1
  }
}

let { floor, random } = Math

getRandomIndex = length => floor(random() * length)

spliceImage = arr => {
  let x = getRandomIndex(arr.length)
  return arr.splice(x, 1)[0]
}
