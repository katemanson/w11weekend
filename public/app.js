window.onload = function(){
  var request = new XMLHttpRequest();
  request.open('GET', 'https://restcountries.eu/rest/v1/all');
  request.onload = function(){
    if (request.status !== 200) return;
    var jsonString = request.responseText;
    var rawCountries = JSON.parse(jsonString);

    prepData(rawCountries);
  }
  request.send();
}

var prepData = function(rawCountries){

  var regionSelector = document.getElementById('select-region');
  regionSelector.style.visibility = 'visible';
  
  var countriesWithData = [];
  for (var country of rawCountries){
    if (country.capital && country.subregion){
      countriesWithData.push(country);
    }
  }

  var subregions = ["Choose a region"];
  for (var country of countriesWithData){
    if ( subregions.indexOf(country.subregion) === -1 ){
      subregions.push(country.subregion);
    }
  }

  for (var i = 0; i < subregions.length; i++) {
    var option = document.createElement('option');
    option.value = subregions[i];
    option.innerText = subregions[i];
    regionSelector.appendChild(option);
  }

  regionSelector.addEventListener('change', function(event){
    var selected = this.value;
    var qCountries = [];
    for ( var country of countriesWithData ){
      if ( country.subregion === selected ){
        qCountries.push(country);
      }
    }

    var countryNames = [];
    for (var i = 0; i < qCountries.length; i++) {
      countryNames.push(qCountries[i].name);
    }

    var capitals = [];
    for (var i = 0; i < qCountries.length; i++) {
      capitals.push(qCountries[i].capital);
    }

    localStorage.setItem('countryNames', JSON.stringify(countryNames));
    localStorage.setItem('capitals', JSON.stringify(capitals));

    var numberAnswers = 0;
    var correctAnswers = 0;

    this.style.visibility = 'hidden';
    
    setQuestion(countryNames, capitals, numberAnswers, correctAnswers);
  });
}

var setQuestion = function(countries, cities, numberAnswers, correctAnswers){

  var countryNames = countries;
  var capitals = cities;

  var randIndexQ = getRandomIndex(countryNames.length - 1, []);
  console.log('countryNames', countryNames);
  console.log('randIndexQ', randIndexQ);

  var qCountry = countryNames[randIndexQ];
  console.log('question country', qCountry);
  var aCapital = capitals[randIndexQ];
  console.log('answer capital', aCapital);

  var qDiv = document.getElementById('question');
  var qText = document.createElement('p');
  qText.id = 'question-text';
  qText.innerHTML = "What is the capital of " + "<b>" + qCountry + "</b>?";
  qDiv.appendChild(qText);

  var randIndexAOne = getRandomIndex((countryNames.length - 1), [randIndexQ]);
  console.log('randIndex first wrong answer', randIndexAOne);
  var randIndexATwo = getRandomIndex((countryNames.length - 1), [randIndexQ, randIndexAOne]);
  console.log('randIndex second wrong answer', randIndexATwo);
  var aOptionOne = capitals[randIndexAOne];
  console.log('first wrong answer', aOptionOne);
  var aOptionTwo = capitals[randIndexATwo];
  console.log('second wrong answer', aOptionTwo);
  var aOptions = [aCapital, aOptionOne, aOptionTwo];
  var aOptions = shuffleArray(aOptions);

  var answerForm = document.getElementById('answer-form');
  for (var i = 0; i < aOptions.length; i++){
    var input = document.createElement('input');
    input.type = 'radio';
    input.name = 'capital';
    input.id = 'option' + (i + 1);
    input.value = aOptions[i];

    var label = document.createElement('label');
    label.for = input.id;
    label.innerHTML = " " + aOptions[i] + "<br>";

    answerForm.appendChild(input);
    answerForm.appendChild(label);
  }

  var answerButton = document.createElement('button');
  answerButton.type = 'submit';
  answerButton.id = 'answer-button';
  answerButton.innerHTML = "Submit";
  answerForm.appendChild(answerButton);

  checkResult(qDiv, answerForm, qCountry, aCapital, aOptions, numberAnswers, correctAnswers);
}

var checkResult = function(qDiv, answerForm, qCountry, aCapital, aOptions, numberAnswers, correctAnswers){

  //? This is weird?
  answerForm.onsubmit = function(event){
    event.preventDefault();
    
    var resultsDiv = document.getElementById('results');
    while (resultsDiv.firstChild){resultsDiv.removeChild(resultsDiv.firstChild);}

    var resultText = document.createElement('p');
    resultText.id = 'result-text';
    resultsDiv.appendChild(resultText);  

    var uncheckedOptions = [];
    for (var i = 0; i < aOptions.length; i++) {
      var input = document.getElementById('option' + (i + 1));
      if (input.checked && input.value === aCapital){
        numberAnswers++;
        correctAnswers++;
        resultText.innerHTML = "Correct!";
      }
      else if (input.checked && input.value !== aCapital){
        numberAnswers++
        resultText.innerHTML = "Nope, sorry. The capital of " + qCountry + " is <b>" + aCapital + "</b>.";
      }
      else if (!input.checked){
        uncheckedOptions.push(input.value);
      }
    }

    if (uncheckedOptions.length >= aOptions.length) {

      resultText.innerHTML = "Uh... you didn't choose an answer?";
      checkResult(qDiv, answerForm, qCountry, aCapital, aOptions, numberAnswers, correctAnswers);
    }
    else if (numberAnswers > 0){
      while (qDiv.firstChild){
        qDiv.removeChild(qDiv.firstChild);
      }
      while (answerForm.firstChild){
        answerForm.removeChild(answerForm.firstChild);
      }
      showNextOptions(numberAnswers, correctAnswers, qDiv, resultsDiv, answerForm);
    }
  }
//ToDo: save question, answer options and answer to local storage
}

var showNextOptions = function(numberAnswers, correctAnswers, qDiv, resultsDiv, answerForm){

  var resultCounter = document.createElement('p')
  resultCounter.id = 'result-counter';
  resultCounter.innerHTML = correctAnswers + " out of " + numberAnswers;
  resultsDiv.appendChild(resultCounter);

  var nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.id = 'next-button';
  nextButton.innerHTML = "New question";

  var finishButton = document.createElement('button');
  finishButton.type = 'button';
  finishButton.id = 'finish-button';
  finishButton.innerHTML = "Finish";

  var nextButtonsDiv = document.getElementById('next-buttons');
  nextButtonsDiv.appendChild(nextButton);
  nextButtonsDiv.appendChild(finishButton);

  nextButton.onclick = function(){
    while (nextButtonsDiv.firstChild){
      nextButtonsDiv.removeChild(nextButtonsDiv.firstChild);
    }

    while (resultsDiv.firstChild){
      resultsDiv.removeChild(resultsDiv.firstChild);
    }

    prepareAnotherQuestion(numberAnswers, correctAnswers);
  }
}

prepareAnotherQuestion = function(numberAnswers, correctAnswers){

  var countryNames = JSON.parse(localStorage.getItem('countryNames'));
  var capitals = JSON.parse(localStorage.getItem('capitals'));

  setQuestion(countryNames, capitals, numberAnswers, correctAnswers);
}

var getRandomIndex = function(maximum, previousIndices){
  var possibleIndices = [];

  for (var i = 0; i <= maximum; i++) {
    possibleIndices.push(i);
  }

  for (var i = 0; i < previousIndices.length; i++) {
    for (var j = 0; j < possibleIndices.length; j++) {
      if (previousIndices[i] === possibleIndices[j]){
        possibleIndices.splice(j, 1);
      }
    }
  }

  possibleIndices = shuffleArray(possibleIndices);
  var index = possibleIndices[0];
  return index;
}

//shuffleArray based on answer at http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
var shuffleArray = function(array){
  var valueHolder;
  var randomIndexToI;
  console.log('array before shuffle', array);
  for (var i = array.length; i; i--) { //<-- i as middle (boolean) condition works (I think) because 0 is (sp?)falsey
    console.log('i', i);
    randomIndexToI = Math.round(Math.random() * (i - 1));
    console.log('random index for shuffle', randomIndexToI);
    valueHolder = array[i - 1];
    array[i - 1] = array[randomIndexToI];
    array[randomIndexToI] = valueHolder;
  }
  console.log('shuffled array', array);
  return array;
}

