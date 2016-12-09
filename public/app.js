window.onload = function(){
  var url = 'https://restcountries.eu/rest/v1/all';
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.onload = function(){
    if(this.status !== 200) return;
    var jsonString = request.responseText;
    var countries = JSON.parse(jsonString);
    setQuestion(countries)
  }
  request.send();
}

var setQuestion = function(countries){
  var countryNames = [];
  for (var i = 0; i < countries.length; i++) {
    countryNames.push(countries[i].name);
  }
  // console.log(countryNames);

  var capitals = [];
  for (var i = 0; i < countries.length; i++) {
    capitals.push(countries[i].capital);
  }
  // console.log(capitals);

  var randomIndexQ = getRandomIndex(countries.length - 1);
  var randomIndexAOne = getRandomIndex((countries.length - 1), [randomIndexQ]);
  var randomIndexATwo = getRandomIndex((countries.length - 1), [randomIndexQ, randomIndexAOne]);

  var questionCountry = countryNames[randomIndexQ];
  var questionElement = document.getElementById('question')
  questionElement.innerHTML = "What is the capital of " + "<b>" + questionCountry + "</b>?";

  var answerCapital = capitals[randomIndexQ];
  var answerOptionOne = capitals[randomIndexAOne];
  var answerOptionTwo = capitals[randomIndexATwo];
  var answerOptions = [answerCapital, answerOptionOne, answerOptionTwo];
  var answerOptions = shuffleArray(answerOptions);

  var answerForm = document.getElementById('answer-form');
  for (var i = 0; i < answerOptions.length; i++) {
    var input = document.createElement('input');
    input.type = 'radio';
    input.name = 'capital';
    input.id = 'option' + (i + 1);
    input.value = answerOptions[i];

    var label = document.createElement('label');
    label.for = 'option' + (i + 1);
    label.innerHTML = answerOptions[i] + "<br>";

    answerForm.appendChild(input);
    answerForm.appendChild(label);
  }
  
  var answerButton = document.createElement('button');
  answerButton.type = 'submit';
  answerButton.id = 'answer-button';
  answerButton.innerHTML = "Submit answer";
  answerForm.appendChild(answerButton);

  answerForm.onsubmit = function(event){
    console.log(event);
  }


}

var getRandomIndex = function(maximum, previousIndices){
  index = Math.round(Math.random() * maximum);

  if (previousIndices){
    for (var i = 0; i < previousIndices.length; i++) {
      if (index === previousIndices[i]){
        getRandomIndex(maximum, previousIndices);
      }
    }
  }
  return index;
}

//shuffleArray based on answer at http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
var shuffleArray = function(array){
  var valueHolder;
  var randomIndexToI;
  for (var i = array.length; i; i--) {
    randomIndexToI = getRandomIndex(i - 1, []);
    valueHolder = array[i - 1];
    array[i - 1] = array[randomIndexToI];
    array[randomIndexToI] = valueHolder;
  }
  return array;
}