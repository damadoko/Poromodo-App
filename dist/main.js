// Module 1: Model
var model = (function() {
  // return console.log("hi!");
  var data = {
    isWorking: null, //stage:  work or break
    workSecond: 0,
    breakSecond: 0,
    tomatoLength: 0,
    currentTomato: 0,
    currentCountDown: 0,
    intervalId: null,
    index: 0,
    isProcessing: null //status: Process or stop
  };

  return {
    processInput: function(inp) {
      // change status: Process or stop
      model.changeStatus();
      if (
        (data.isProcessing && data.workSecond === 0) ||
        (data.isProcessing && data.breakSecond === 0)
      ) {
        // Add input to model
        model.addInput(inp.workTime, inp.breakTime, inp.loopTime);
        // Show tomatoes left
        UIController.displayTomatoesLeft(data.tomatoLength - data.index);
        model.startCountDown();
      } else if (data.isProcessing) {
        model.startCountDown();
      } else {
        model.stopCountDown();
      }
    },

    addInput: function(workSec, breakSec, loop) {
      data.workSecond = workSec;
      data.breakSecond = breakSec;
      data.tomatoLength = loop;
      if (data.index === 0 && data.isWorking) {
        for (var i = 0; i < loop; i++) {
          UIController.addTomato();
        }
      } else if (data.index > 0 && data.isWorking) {
        UIController.clearCurrentTomato(0);
      }
      if (data.isWorking) {
        UIController.displayCurrentTomato(0);
      }
      if (data.isWorking) {
        data.currentCountDown = data.workSecond;
      } else {
        data.currentCountDown = data.breakSecond;
      }
    },

    countDown: function() {
      if (data.currentCountDown >= 1) {
        data.currentCountDown = data.currentCountDown - 1;
        UIController.displayCountDown(data.isWorking, data.currentCountDown);
      } else if (data.index === data.tomatoLength - 1 && !data.isWorking) {
        UIController.displayFinish();
        UIController.DelStartStopButton();
        UIController.delCountDown();
        model.reset();
      } else {
        if (!data.isWorking) {
          data.index++;
        }
        model.changeStage();
        model.changeStatus();
        // console.log("Hello world!");
        alert("Done!");
        clearInterval(model.intervalId);
        data.workSecond = 0;
        data.breakSecond = 0;
        UIController.displayContinute();
      }
    },
    // Start countdown and show countdown
    startCountDown: function() {
      UIController.displayCountDown(data.isWorking, data.currentCountDown);
      UIController.displayStop();
      model.intervalId = setInterval(model.countDown, 1000);
    },

    stopCountDown: function() {
      clearInterval(model.intervalId);
      UIController.displayContinute();
    },
    // Change status and stage
    changeStatus: function() {
      if (data.isProcessing) {
        data.isProcessing = false;
      } else {
        data.isProcessing = true;
      }
    },

    changeStage: function() {
      if (data.isWorking) {
        data.isWorking = false;
      } else {
        data.isWorking = true;
      }
    },

    reset: function() {
      data.isWorking = true;
      data.isProcessing = false;
      data.workSecond = 0;
      data.breakSecond = 0;
      model.stopCountDown();
      // UIcontroller.addStartStopButton();
      UIController.clearAllTomatoes();
    },
    data: data
  };
})();

// Module 2: User Interface Controller
var UIController = (function() {
  var DOMstring = {
    work: "work-time",
    break: "break-time",
    loop: "loop-time",
    start: "start-btn",
    count: "count-down",
    startStop: "start-stop",
    startStopContainer: "countdown-box",
    backbtn: "back-btn",
    tomatoesContainter: ".tomato-img",
    tomatoesClass: "tomato",
    currentTomato: "current-icon",
    clearTomato: "clear-icon",
    tomatoesLeft: "tomatoes-left",
    countDown: "countdowns",
    yourTomato: "your-tomatoes"
  };
  return {
    getUserInput: function() {
      return {
        workTime: document.getElementById(DOMstring.work).value * 60,
        breakTime: document.getElementById(DOMstring.break).value * 60,
        loopTime: parseInt(document.getElementById(DOMstring.loop).value)
      };
    },
    displayCountDown: function(stat, sec) {
      var isWork;
      if (stat) {
        isWork = "Working";
      } else {
        isWork = "Breaking";
      }
      document.getElementById(DOMstring.count).innerHTML =
        isWork + " in " + sec + " seconds.";
    },
    delCountDown: function() {
      var random, quotes;
      quotes = [
        "Your limitation—it's only your imagination.",
        "Push yourself, because no one else is going to do it for you.",
        "Sometimes later becomes never. ...",
        "Great things never come from comfort zones.",
        "The harder you work for something, the greater you'll feel when you achieve it.",
        " It’s going to be hard, but hard does not mean impossible.",
        "Don’t wait for opportunity. Create it."
      ];
      random = Math.floor(Math.random() * quotes.length);

      document.getElementById(DOMstring.count).innerHTML = quotes[random];
    },
    displayContinute: function() {
      document.getElementById(DOMstring.startStop).innerHTML = "Continute!";
    },
    displayStop: function() {
      document.getElementById(DOMstring.startStop).innerHTML = "Stop.";
    },
    displayCurrentTomato: function(cur) {
      var tomatoes = document.getElementsByClassName(DOMstring.tomatoesClass);
      tomatoes[cur].setAttribute("class", DOMstring.currentTomato);
    },
    clearCurrentTomato: function(cur) {
      var tomatoes = document.getElementsByClassName(DOMstring.currentTomato);
      tomatoes[cur].setAttribute("class", DOMstring.clearTomato);
    },
    addTomato: function() {
      var html =
        '<img class="tomato" src="/dist/images/icon1.svg" alt="tomato icon"/>';
      document
        .querySelector(DOMstring.tomatoesContainter)
        .insertAdjacentHTML("beforeend", html);
    },
    clearAllTomatoes: function() {
      document.querySelector(DOMstring.tomatoesContainter).innerHTML = "";
    },
    displayTomatoesLeft: function(num) {
      document.getElementById(DOMstring.tomatoesLeft).innerHTML =
        "There are " + num + " tomatoes left!";
    },
    displayFinish: function() {
      var finishQuote = document.getElementById(DOMstring.tomatoesLeft);
      finishQuote.innerHTML =
        "Congratulation! You are finished the process, Take a long break before starting a gain!";
      finishQuote.setAttribute("class", "heading-l, center, py-1");
      document.getElementById(DOMstring.yourTomato).innerHTML = "";
      document.getElementById(DOMstring.countDown).innerHTML = "";
      // "There are " + num + " tomatoes left!";
    },
    DelStartStopButton: function() {
      document
        .getElementById(DOMstring.startStop)
        .setAttribute("class", "hide");
    },
    addStartStopButton: function() {
      // html = '<button class="btn" id="start-stop">Stop</button>';
      document.getElementById(DOMstring.startStop).setAttribute("class", "btn");
    },
    getDOM: DOMstring
  };
})();

// Module 3: App Controller
var controller = (function(mod, UI) {
  // Get DOMString
  var DOM = UI.getDOM;
  var ctrlInput = function() {
    var startbutton = document.getElementById(DOM.startStop).className;
    if (startbutton === "hide") {
      UIController.addStartStopButton();
    }
    // Get input
    var input = UI.getUserInput();
    if (
      input.workTime > 0 &&
      !isNaN(input.workTime) &&
      input.breakTime > 0 &&
      !isNaN(input.breakTime) &&
      input.loopTime > 0 &&
      !isNaN(input.loopTime)
    ) {
      mod.processInput(input);
    } else {
      alert("Please input the valid number!");
    }
  };

  // Add event
  var setUpEventListener = function() {
    document.getElementById(DOM.start).addEventListener("click", ctrlInput);
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlInput();
      }
    });
    document.getElementById(DOM.backbtn).addEventListener("click", mod.reset);
    document.getElementById(DOM.startStop).addEventListener("click", ctrlInput);
  };

  return {
    init: function() {
      setUpEventListener();
      mod.reset();
    }
  };
})(model, UIController);

window.onload = controller.init;

// 1. get input
// 2. store state of the app (work and break, stop and continute)
// 3. show countdown, tomato left
