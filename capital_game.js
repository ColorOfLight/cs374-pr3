// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

//= Global Varaibles
var ANSWER = null;
var HISTORY = [];
var HISTORY_TYPE = "all";
var INDEX = 0;

//= Get csv file and extract it into JS Object
try {
  console.log("CSV file is on loading...")
  $.ajax({
    url: "https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv",
    success: function (data, status, xhr) {
      window.pairs = convertCSVtoObject(data);
      console.log("CSV file is loaded!")
      initFirebase();
      initFuncs();
    },
    error: function(xhr, ajaxOptions, error) {
      alert("Failed to read csv. Please try again later or ask to developer.");
    }
  });
} catch (e) {
  console.error(e.message);
}

function initFirebase() {
  // Firebase Database setup
  var database = firebase.database();

  var historyRef = database.ref('history');

  historyRef.once("value").then(function(snapshot) {
<<<<<<< HEAD
    var historyObject = snapshot.val();
    HISTORY = historyObject;
=======
>>>>>>> 2a8c3802d5742519387e47202c7488c04478400e
    Object.keys(HISTORY).forEach(function(key) {
      var historyItem = HISTORY[key];
      if (!historyItem.isDeleted) {
        insertAnswerDOM(historyItem.input, historyItem.answer, historyItem.isCorrect, key);
      }
    });
  });
<<<<<<< HEAD
=======

  historyRef.on('value', function (snapshot) {
    var historyObject = snapshot.val()
    HISTORY = historyObject;
  });
>>>>>>> 2a8c3802d5742519387e47202c7488c04478400e
}

//= Run code when document is ready
function initFuncs() {
  $(document).ready(function() {
    var country_capital_pairs = window.pairs;
    var $questionColumn = $("#pr2__question");
    var $answerInput = $("#pr2__answer");
    var $submitButton = $("#pr2__submit");

    resetInputRow();

    $answerInput.autocomplete({ source: function(request, response) {
        var capitals = pairs.map(function(obj) {
          return obj.capital;
        });
        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
        response($.grep(capitals, function(value) {
            value = value.label || value.value || value;
            return matcher.test(value);
          }));
      }, minLength: 2 });

    $submitButton.on("click", function(evt) {
      var inputText = $answerInput.val();
      if (inputText !== "") {
        checkAnswer(inputText);
      }
    });

    $answerInput.on("autocompleteselect", function(evt, ui) {
      var input = (ui.item && ui.item.value) || ui.item.label;
      checkAnswer(input);
      return false;
    });

    $("#radioRow input[type='radio']").on("click", function(evt) {
      var type = $(this).val();
      if (HISTORY_TYPE !== type) {
        changeHistoryType(type);
      }
    });

    $questionColumn.on("click", function(evt) {
      replaceMapQuery($(evt.currentTarget).text());
    });
  });
}

//= Functions
function checkAnswer(input) {
  var isCorrect = input === ANSWER.capital;

  if (isCorrect && HISTORY_TYPE === "wrong") {
    $("#radioRow input[value='all']").click();
  } else if (!isCorrect && HISTORY_TYPE === "correct") {
    $("#radioRow input[value='all']").click();
  }

  var historyItem = {
    answer: ANSWER,
    input: input,
    isCorrect: isCorrect,
    isDeleted: false
  }
  var newPostKey = firebase.database().ref().child('history').push(historyItem).key;
  HISTORY[newPostKey] = historyItem;
  insertAnswerDOM(input, ANSWER, isCorrect, newPostKey);

  resetInputRow();
}

function resetInputRow() {
  var $answerInput = $("#pr2__answer");
  var $questionColumn = $("#pr2__question");

  var answerRandomNumber = Math.floor(Math.random() * pairs.length);
  ANSWER = pairs[answerRandomNumber];

  $answerInput.val("");
  $questionColumn.text(ANSWER.country);

  $answerInput.focus();

  // Show map of the country in question
  replaceMapQuery(ANSWER['country']); 
}

function insertAnswerDOM(input, answer, isCorrect, index = null) {
  var element = null;
  if (isCorrect) {
    element = $(
      '<tr class="history correct"><td class="country">' +
        answer.country +
        '</td><td class="capital">' +
        input +
        '</td><td><i class="fas fa-check" /><button class="delete">Delete</button></td></tr>'
    );
  } else {
    element = $(
      '<tr class="history incorrect"><td class="country">' +
        answer.country +
        '</td><td class="capital">' +
        input +
        "</td><td>" +
        answer.capital +
        '<button class="delete">Delete</button></td></tr>'
    );
  }

  var inputIndex = index;
  if (!inputIndex) {
    inputIndex = INDEX;
    INDEX++;
  }

  $(element)
    .find(".delete")
    .data("key", inputIndex)
    .on("click", function(evt) {
      var $this = $(this);
      Object.keys(HISTORY).forEach(function(key) {
        if (key === $this.data("key")) {
          var historyItem = HISTORY[key];
          historyItem['isDeleted'] = true;
          var updates = {};
          updates['/history/' + key] = historyItem;
          firebase.database().ref().update(updates);
          $(element).remove();
        }
<<<<<<< HEAD
=======
      }
      Object.keys(HISTORY).forEach(function(key) {
        var historyItem = HISTORY[key];
        if (key === $(this).data("key")) {
          $(element).remove();
          HISTORY.splice(x, 1);
        }
>>>>>>> 2a8c3802d5742519387e47202c7488c04478400e
      });
    });

  $(element).find(".country").on("click", function(evt) {
    replaceMapQuery(answer.country);
  });

  element.insertAfter("#radioRow");
}

function changeHistoryType(type) {
  HISTORY_TYPE = type;
  $(".history").remove();

<<<<<<< HEAD
  Object.keys(HISTORY).forEach(function(key) {
    var historyItem = HISTORY[key];
    if (!historyItem.isDeleted) {
      if (HISTORY_TYPE === "correct") {
        if (historyItem.isCorrect) {
          insertAnswerDOM(historyItem.input, historyItem.answer, historyItem.isCorrect, key);
        }
      } else if (HISTORY_TYPE === "wrong") {
        if (!historyItem.isCorrect) {
          insertAnswerDOM(historyItem.input, historyItem.answer, historyItem.isCorrect, key);
        }
      } else {
        insertAnswerDOM(historyItem.input, historyItem.answer, historyItem.isCorrect, key);
      }
=======
  for (var x = 0; x < HISTORY.length; x++) {
    var historyElement = HISTORY[x];
    if (HISTORY_TYPE === "correct") {
      if (historyElement.isCorrect) {
        insertAnswerDOM(
          historyElement.input,
          historyElement.answer,
          historyElement.isCorrect
        );
      }
    } else if (HISTORY_TYPE === "wrong") {
      if (!historyElement.isCorrect) {
        insertAnswerDOM(
          historyElement.input,
          historyElement.answer,
          historyElement.isCorrect,
          historyElement.id
        );
      }
    } else {
      insertAnswerDOM(
        historyElement.input,
        historyElement.answer,
        historyElement.isCorrect,
        historyElement.id
      );
>>>>>>> 2a8c3802d5742519387e47202c7488c04478400e
    }
  });

  // for (var x = 0; x < HISTORY.length; x++) {
  //   var historyElement = HISTORY[x];
  //   if (HISTORY_TYPE === "correct") {
  //     if (historyElement.isCorrect) {
  //       insertAnswerDOM(
  //         historyElement.input,
  //         historyElement.answer,
  //         historyElement.isCorrect
  //       );
  //     }
  //   } else if (HISTORY_TYPE === "wrong") {
  //     if (!historyElement.isCorrect) {
  //       insertAnswerDOM(
  //         historyElement.input,
  //         historyElement.answer,
  //         historyElement.isCorrect,
  //         historyElement.id
  //       );
  //     }
  //   } else {
  //     insertAnswerDOM(
  //       historyElement.input,
  //       historyElement.answer,
  //       historyElement.isCorrect,
  //       historyElement.id
  //     );
  //   }
  // }
}

function convertCSVtoObject(csvData) {
  var rows = csvData.split('\n');
  if (!rows || rows.length < 0) {
    throw new Error("convertCSVtoObject: input data may be not CSV data!");
  }
  rows = rows.map(function(obj) { return obj.trim() })
  var result = [];
  var keys = rows[0].split(',');
  for (var i = 1; i < rows.length; i++) {
    var item = {};
    var columns = rows[i].split(',');
    if (keys.length !== columns.length) {
      throw new Error("convertCSVtoObject: length of rows and length of keys are different!")
    }
    for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      item[keys[keyIndex]] = columns[keyIndex]
    }
    result.push(item);
  }
  return result;
}

function replaceMapQuery(country) {
  var $map = $('#pr3__map');
  var originalUrl = $map.attr('src');
  $map.attr("src", originalUrl.replace(/q=.+?(?=&|$)/, "q=" + country));
}