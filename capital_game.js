// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

var ANSWER = null;
var HISTORY = [];
var HISTORY_TYPE = "all";
var INDEX = 0;

$(document).ready(function() {
  var country_capital_pairs = pairs;
  var $questionColumn = $("#pr2__question");
  var $answerInput = $("#pr2__answer");
  var $submitButton = $("#pr2__submit");

  resetInputRow();

  $answerInput.autocomplete({
    source: function(request, response) {
      var capitals = pairs.map(function(obj) {
        return obj.capital;
      });
      var matcher = new RegExp(
        $.ui.autocomplete.escapeRegex(request.term),
        "i"
      );
      response(
        $.grep(capitals, function(value) {
          value = value.label || value.value || value;
          return matcher.test(value);
        })
      );
    },
    minLength: 2
  });

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
});

function checkAnswer(input) {
  var isCorrect = input === ANSWER.capital;

  if (isCorrect && HISTORY_TYPE === "wrong") {
    $("#radioRow input[value='all']").click();
  } else if (!isCorrect && HISTORY_TYPE === "correct") {
    $("#radioRow input[value='all']").click();
  }

  HISTORY.push({
    id: INDEX,
    answer: ANSWER,
    input: input,
    isCorrect: isCorrect
  });
  insertAnswerDOM(input, ANSWER, isCorrect);

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
}

function insertAnswerDOM(input, answer, isCorrect) {
  var element = null;
  if (isCorrect) {
    element = $(
      '<tr class="history correct"><td>' +
        answer.country +
        '</td><td class="capital">' +
        input +
        '</td><td><i class="fas fa-check" /><button class="delete">Delete</button></td></tr>'
    );
  } else {
    element = $(
      '<tr class="history incorrect"><td>' +
        answer.country +
        '</td><td class="capital">' +
        input +
        "</td><td>" +
        answer.capital +
        '<button class="delete">Delete</button></td></tr>'
    );
  }

  $(element)
    .find(".delete")
    .data("id", INDEX)
    .on("click", function(evt) {
      for (var x = 0; x < HISTORY.length; x++) {
        if (HISTORY[x].id === $(this).data("id")) {
          $(element).remove();
        }
      }
    });

  INDEX++;
  element.insertAfter("#radioRow");
}

function changeHistoryType(type) {
  HISTORY_TYPE = type;
  $(".history").remove();

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
          historyElement.isCorrect
        );
      }
    } else {
      insertAnswerDOM(
        historyElement.input,
        historyElement.answer,
        historyElement.isCorrect
      );
    }
  }
}
