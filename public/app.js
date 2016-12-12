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

    var coords = {};
    var zoom = 4; // zoom 'defaults' to 4
    switch (this.value){
      case "Southern Asia":
        coords = {lat:31, lng:65};
        zoom = 3;
        break;
      case "Northern Europe":
        coords = {lat:56, lng:1};
        zoom = 3;
        break;
      case "Southern Europe":
        coords = {lat:42.8, lng:12.8};
        break;
      case "Northern Africa":
        coords = {lat:25.5, lng:9.7};
        zoom = 3;
        break;
      case "Polynesia":
        coords = {lat:-15, lng:-166};
        zoom = 3;
        break;
      case "Middle Africa":
        coords = {lat:1.4, lng:18};
        break;
      case "Caribbean":
        coords = {lat:17, lng:-70};
        break;
      case "South America":
        coords = {lat:-25, lng:-60};
        zoom = 3;
        break;
      case "Western Asia":
        coords = {lat:25, lng:45};
        break;
      case "Australia and New Zealand":
        coords = {lat:-30, lng:147};
        zoom = 3;
        break;
      case "Western Europe":
        coords = {lat:48, lng:7};
        break;
      case "Eastern Europe":
        coords = {lat:50, lng:26};
        break;
      case "Central America":
        coords = {lat:15, lng:-87};
        break;
      case "Western Africa":
        coords = {lat:13, lng:-2};
        break;
      case "Northern America":
        coords = {lat:46, lng:-106};
        zoom = 2;
        break;
      case "Southern Africa":
        coords = {lat:-27, lng:24};
        break;
      case "Eastern Africa":
        coords = {lat:-9, lng:37};
        break;
      case "South-Eastern Asia":
        coords = {lat:5, lng:113};
        zoom = 3;
        break;
      case "Eastern Asia":
        coords = {lat:38, lng:113};
        zoom = 3;
        break;
      case "Melanesia":
        coords = {lat:-15, lng:166};
        break;
      case "Micronesia":
        coords = {lat:8, lng:158};
        break;
      case "Central Asia":
        coords = {lat:44, lng:65};
    }

    var mapDiv = document.getElementById('main-map');
    mapDiv.display = 'block';
    var map = new google.maps.Map(mapDiv, {
      center: coords,
      zoom: zoom,
      styles: [
        {
          featureType: 'administrative.land-parcel',
          elementType: 'labels',
          stylers: [{visibility: 'off'}]
        }, 
        {
          featureType: 'administrative.country',
          elementType: 'labels',
          stylers: [{visibility: 'on'}]
        },
        {
          featureType: 'administrative.locality',
          elementType: 'labels',
          stylers: [{visibility: 'off'}]
        }, 
        {
          featureType: 'administrative.neighborhood',
          elementType: 'labels',
          stylers: [{visibility: 'off'}]
        }, 
        {
          featureType: 'administrative.province',
          elementType: 'labels',
          stylers: [{visibility: 'off'}]
        }
      ]
    });
    
    setQuestion(countryNames, capitals, numberAnswers, correctAnswers);
  });
}

var setQuestion = function(countries, cities, numberAnswers, correctAnswers){

  var countryNames = countries;
  var capitals = cities;

  var randIndexQ = getRandomIndex(countryNames.length - 1, []);

  var qCountry = countryNames[randIndexQ];
  
  var qDiv = document.getElementById('question');
  var answerForm = document.getElementById('answer-form');
  var questionSet = JSON.parse(localStorage.getItem('questionSet')) || [];
  var upToLastThreeQuestions = [];
  if ( questionSet.length <= 3 ){ upToLastThreeQuestions = questionSet; }
  else if ( questionSet.length > 3 ){
    upToLastThreeQuestions = questionSet.slice(questionSet.length - 3);
  }
  console.log('up to last three questions', upToLastThreeQuestions);

  for (var i = 0; i < upToLastThreeQuestions.length; i++) {
    if ( qCountry === upToLastThreeQuestions[i].questionCountry ){
      console.log('in if statement');
      console.log('qCountry', qCountry);
      console.log('upToLastThreeQuestions[i].questionCountry', upToLastThreeQuestions[i].questionCountry);
      qDiv.innerHTML = "";
      console.log('qDiv', qDiv);
      console.log('qDiv.children', qDiv.children);
      answerForm.innerHTML = "";
      setQuestion(countries, cities, numberAnswers, correctAnswers);
    }
  }

  var aCapital = capitals[randIndexQ];

  var qText = document.createElement('p');
  qText.id = 'question-text';
  qText.innerHTML = "What is the capital of " + "<b>" + qCountry + "</b>?";
  qDiv.appendChild(qText);

  var randIndexAOne = getRandomIndex((countryNames.length - 1), [randIndexQ]);
  var randIndexATwo = getRandomIndex((countryNames.length - 1), [randIndexQ, randIndexAOne]);
  var aOptionOne = capitals[randIndexAOne];
  var aOptionTwo = capitals[randIndexATwo];
  var aOptions = [aCapital, aOptionOne, aOptionTwo];
  var aOptions = shuffleArray(aOptions);

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

  //? This is weird: onsubmit inside checkResult, with nothing else?
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

      var questionSet = JSON.parse(localStorage.getItem('questionSet')) || [];

      var questionRecord = {
        "questionNumber": numberAnswers,
        "questionCountry": qCountry,
        "answerCapital": aCapital,
        "answerOptions": aOptions,
        "numberAnswers": numberAnswers,
        "correctAnswers": correctAnswers
      };
      questionSet.push(questionRecord);

      localStorage.setItem('questionSet', JSON.stringify(questionSet));

      showNextOptions(numberAnswers, correctAnswers, qDiv, resultsDiv, answerForm);
    }
  }
}

var showNextOptions = function(numberAnswers, correctAnswers, qDiv, resultsDiv, answerForm){

  var resultCounter = document.createElement('p');
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
  };

  finishButton.onclick = function(){
    while (nextButtonsDiv.firstChild){
      nextButtonsDiv.removeChild(nextButtonsDiv.firstChild);
    }
    while (resultsDiv.firstChild){
      resultsDiv.removeChild(resultsDiv.firstChild);
    }
    var mapDiv = document.getElementById('main-map');
    while (mapDiv.firstChild){
      mapDiv.removeChild(mapDiv.firstChild);
    }

    //display record of questions in session

  };
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
  // console.log('array before shuffle', array);
  for (var i = array.length; i; i--) { //<-- i as middle (boolean) condition works (I think) because 0 is falsey(sp?); this means there isn't an iteration where i = 0
    randomIndexToI = Math.round(Math.random() * (i - 1));
    // console.log('random index for shuffle', randomIndexToI);
    valueHolder = array[i - 1];
    array[i - 1] = array[randomIndexToI];
    array[randomIndexToI] = valueHolder;
  }
  // console.log('shuffled array', array);
  return array;
}

