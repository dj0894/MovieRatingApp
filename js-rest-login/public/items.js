/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/services.js":
/*!*************************!*\
  !*** ./src/services.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "performLogin": () => (/* binding */ performLogin),
/* harmony export */   "performLogout": () => (/* binding */ performLogout),
/* harmony export */   "checkLoginStatus": () => (/* binding */ checkLoginStatus)
/* harmony export */ });
var performLogin = function performLogin(username) {
  return fetch('/session', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({
      username: username
    })
  })["catch"](function () {
    return Promise.reject({
      error: 'network-error'
    });
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    }

    return response.json().then(function (err) {
      return Promise.reject(err);
    });
  });
};
var performLogout = function performLogout() {
  return fetch('/logout', {
    method: 'POST'
  })["catch"](function () {
    return Promise.reject({
      error: 'network-error'
    });
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    }

    return response.json().then(function (err) {
      return Promise.reject(err);
    });
  });
};
var checkLoginStatus = function checkLoginStatus() {
  return fetch('/session', {
    method: 'GET'
  })["catch"](function () {
    return Promise.reject({
      error: 'network-error'
    });
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    }

    return response.json().then(function (err) {
      return Promise.reject(err);
    });
  });
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/items.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services.js */ "./src/services.js");

var scores = {};
var items = document.querySelector(".items-div .items");
var inputElement = document.querySelector(".to-add-items .item-input");
var status = document.querySelector('.status');
var loginStatus = document.querySelector('.login-status');
var inputButton = document.querySelector(".to-add-items .add-btn");
addActionToLogin();
addActionToLogout();
addActionToSortingRadioButton();
disableButtonIfNoInput(); // translate error codes to human-friendly messages

var errMsgs = {
  'duplicate': 'That item already exists',
  'network-error': 'There was a problem connecting to the network, try again'
};

function updateStatus(message) {
  status.innerText = message;
} // Check for login


(0,_services_js__WEBPACK_IMPORTED_MODULE_0__.checkLoginStatus)().then(function (userInfo) {
  showContent();
  scores = userInfo.scores;
  document.getElementById("username").value = userInfo.username;
  document.getElementById('logged-user').innerHTML = userInfo.username;
  renderScores(scores);
  updateLatestScores();
})["catch"](function (error) {
  showLogin();
}); //show content after login by removing and adding classList.add/classList.remove

function showContent() {
  document.querySelector('.main-div .login').classList.add('hidden');
  document.querySelector('.main-div .logout.hidden').classList.remove('hidden');
  document.querySelector('.main-div .to-add-items.hidden').classList.remove('hidden');
  document.querySelector('.main-div .status.hidden').classList.remove('hidden');
  document.querySelector('.main-div .items-div.hidden').classList.remove('hidden');
  document.querySelector('.main-div .items-div .items.hidden').classList.remove('hidden');
} //Hinding content after logout by removing and adding classList.add/classList.remove


function hideContent() {
  document.querySelector('.main-div .logout').classList.add('hidden');
  document.querySelector('.main-div .to-add-items').classList.add('hidden');
  document.querySelector('.main-div .status').classList.add('hidden');
  document.querySelector('.main-div .items-div').classList.add('hidden');
  document.querySelector('.main-div .items-div .items').classList.add('hidden');
}

function showLogin() {
  document.querySelector(' .main-div .login').classList.remove('hidden');
}

function addActionToLogin() {
  document.querySelector('.main-div .login  button').addEventListener('click', function () {
    var usernameEl = document.querySelector('.main-div .login input');
    var username = usernameEl.value; // call service

    (0,_services_js__WEBPACK_IMPORTED_MODULE_0__.performLogin)(username).then(function (userInfo) {
      showContent();
      document.getElementById("username").value = username;
      document.getElementById('logged-user').innerHTML = userInfo.username;
      scores = userInfo.scores;
      renderScores(scores);
      updateLatestScores();
      loginStatus.innerText = '';
    })["catch"](function (err) {
      loginStatus.innerText = err.errors[0];
    });
  });
}

function addActionToLogout() {
  document.querySelector('.main-div .logout  button').addEventListener('click', function () {
    // call service
    (0,_services_js__WEBPACK_IMPORTED_MODULE_0__.performLogout)().then(function (userInfo) {
      hideContent();
      showLogin();
    })["catch"](function (err) {
      console.log(err);
    });
  });
}

function addActionToSortingRadioButton() {
  var sortingValues = document.getElementsByName('sort');

  for (var i = 0; i < sortingValues.length; i++) {
    sortingValues[i].onclick = function () {
      fetchLatestScores();
    };
  }
}

function updateLatestScores() {
  var timerId = setTimeout(function tick() {
    fetchLatestScores();
    timerId = setTimeout(tick, 5000); // (*)
  }, 5000);
} // Adding event handler on X button calling DELETE API 


items.addEventListener('click', function (e) {
  // The below 'if' is making sure they clicked on the X
  // and not elsewhere in the list
  var username = document.getElementById("username").value;
  var data = {
    'username': username
  };

  if (e.target.classList.contains('delete')) {
    var id = e.target.dataset.index;
    fetch("/scores/".concat(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })["catch"](function () {
      return Promise.reject({
        error: 'network-error'
      });
    }).then(convertError).then(function (scores) {
      renderScores(scores);
      updateStatus('');
    })["catch"](function (err) {
      console.log("error");
      updateStatus(errMsgs[err.error] || err.error);
    });
  }
}); //Adding event handler on ADD button and calling POST api for creating scores item

inputButton.addEventListener('click', function () {
  var name = inputElement.value;
  var username = document.getElementById("username").value;
  var data = {
    'username': username
  };

  if (name) {
    fetch("/scores/".concat(name), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })["catch"](function () {
      return Promise.reject({
        error: 'network-error'
      });
    }).then(convertError).then(function (scores) {
      renderScores(scores);
      inputElement.value = '';
      updateStatus('');
    })["catch"](function (err) {
      updateStatus(errMsgs[err.error] || err.error);
    });
  }
}); //Adding event handler in items list on + button and calling PUT api for increasing the quantity by 1

items.addEventListener('click', function (e) {
  if (e.target.classList.contains('increase1')) {
    var id = e.target.dataset.index;
    var username = document.getElementById("username").value;
    var body = {
      "scoreChange": 1,
      "username": username
    };
    fetch("/scores/score/".concat(id), {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json' // 'Content-Type': 'application/x-www-form-urlencoded',

      }
    })["catch"](function () {
      return Promise.reject({
        error: 'network-error'
      });
    }).then(convertError).then(function (score) {
      fetchLatestScores();
      updateStatus('');
    })["catch"](function (err) {
      console.log("error");
      updateStatus(errMsgs[err.error] || err.error);
    });
  }
}); //Adding event handler in items list on - button and calling PUT api for decreasing the score by 1

items.addEventListener('click', function (e) {
  if (e.target.classList.contains('decrease1')) {
    var id = e.target.dataset.index;
    var username = document.getElementById("username").value;
    var body = {
      'scoreChange': -1,
      'username': username
    };
    fetch("/scores/score/".concat(id), {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })["catch"](function () {
      return Promise.reject({
        error: 'network-error'
      });
    }).then(convertError).then(function (score) {
      fetchLatestScores();
      updateStatus('');
    })["catch"](function (err) {
      console.log("error");
      updateStatus(errMsgs[err.error] || err.error);
    });
  }
});

function fetchLatestScores() {
  var username = document.getElementById("username").value;
  fetch("/scores/items/".concat(username), {
    method: 'GET'
  })["catch"](function () {
    return Promise.reject({
      error: 'network-error'
    });
  }).then(convertError).then(function (scores) {
    renderScores(scores);
    updateStatus('');
  })["catch"](function (err) {
    console.log("error");
    updateStatus(errMsgs[err.error] || err.error);
  });
}

function disableButtonIfNoInput() {
  // Disable button if no text in input field
  inputElement.addEventListener('input', function () {
    inputButton.disabled = !inputElement.value;
    inputButton.classList.add('enabled-btn');
  });
}

function convertError(response) {
  if (response.ok) {
    return response.json();
  }

  return response.json().then(function (err) {
    return Promise.reject(err);
  });
} //Rendering the UI using grid


function renderScores(scores) {
  var sortingValues = document.getElementsByName('sort');
  var sortingOrder = "";

  for (var i = 0, length = sortingValues.length; i < length; i++) {
    if (sortingValues[i].checked) {
      // Once radio button checked perform sorting
      sortingOrder = sortingValues[i].value; // only one radio can be logically checked, don't check the rest

      break;
    }
  }

  var orderedScores = [];
  Object.entries(scores);

  if (sortingOrder === 'asc') {
    orderedScores = Object.entries(scores).sort(function (a, b) {
      return a[1].score - b[1].score;
    });
  } else if (sortingOrder === 'desc') {
    orderedScores = Object.entries(scores).sort(function (a, b) {
      return b[1].score - a[1].score;
    });
  } else {
    orderedScores = Object.entries(scores);
  }

  var html = orderedScores.map(function (item) {
    return "\n           <div class=\"grid-container\">\n              \n                <div class=\"grid-item\"><span class=\"item\" data-index=\"".concat(item[0], "\">").concat(item[1].name, "</span></div>\n                <div class=\"grid-item\"><span class=\"delete\" data-index=\"").concat(item[0], "\">X</span></div>\n                <div class=\"grid-item\"><span class=\"decrease1 ").concat(item[1].score == 1 ? "disabled" : '', "\"  data-index=\"").concat(item[0], "\">-</sapn></div>     \n                <div class=\"grid-item\"><span id=\"score\"class=\"score\" data-index=\"").concat(item[0], "\">").concat(item[1].score, "</span></div>\n                <div class=\"grid-item\"> <span class=\"increase1 ").concat(item[1].score == 5 ? "disabled" : '', "\" data-index=\"").concat(item[0], "\">+</span></div>\n            </div>\n          ");
  }).join('');
  items.innerHTML = html;
  inputButton.disabled = !inputElement.value;
}

;
})();

/******/ })()
;
//# sourceMappingURL=items.js.map