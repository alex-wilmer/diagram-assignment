log = function (a) {
  console.log(a);
};

randomString = function () {
  return Math.random().toString(36).slice(-8);
}

range = function (low, high) {
  var arr = []
    , counter = high - low + 1;
  while (counter--) {
    arr[counter] = high--;
  }
  return arr;
}

weirdInvert = function (n) { 
  switch(n) {
    case '1':
      return 9;
    case '2':
      return 7;
    case '3':
      return 5;
    case '4':
      return 3;
    case '5':
      return 1;
  }
};