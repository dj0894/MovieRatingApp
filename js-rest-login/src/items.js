import {
    checkLoginStatus,
    performLogin,
    performLogout
} from './services.js';

let scores = {}

const items = document.querySelector(".items-div .items");
const inputElement = document.querySelector(".to-add-items .item-input");
const status = document.querySelector('.status');
const loginStatus = document.querySelector('.login-status');
const inputButton = document.querySelector(".to-add-items .add-btn");

addActionToLogin();
addActionToLogout();
addActionToSortingRadioButton();
disableButtonIfNoInput();

// translate error codes to human-friendly messages
const errMsgs = {
    'duplicate': 'That item already exists',
    'network-error': 'There was a problem connecting to the network, try again',

};

function updateStatus(message) {
    status.innerText = message;
}



// Check for login
checkLoginStatus()
    .then((userInfo) => {
        showContent();
        scores = userInfo.scores;
        document.getElementById("username").value = userInfo.username;
        document.getElementById('logged-user').innerHTML = userInfo.username;
        renderScores(scores);
        updateLatestScores();
    })
    .catch(error => {
        showLogin();
    });


//show content after login by removing and adding classList.add/classList.remove
function showContent() {
    document.querySelector('.main-div .login').classList.add('hidden');
    document.querySelector('.main-div .logout.hidden').classList.remove('hidden');
    document.querySelector('.main-div .to-add-items.hidden').classList.remove('hidden');
    document.querySelector('.main-div .status.hidden').classList.remove('hidden');
    document.querySelector('.main-div .items-div.hidden').classList.remove('hidden');
    document.querySelector('.main-div .items-div .items.hidden').classList.remove('hidden');
}

//Hinding content after logout by removing and adding classList.add/classList.remove
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
    document.querySelector('.main-div .login  button').addEventListener('click', () => {
        const usernameEl = document.querySelector('.main-div .login input');
        const username = usernameEl.value;
        // call service
        performLogin(username)
            .then(userInfo => {
                showContent();
                document.getElementById("username").value = username;
                document.getElementById('logged-user').innerHTML = userInfo.username;
                scores = userInfo.scores;
                renderScores(scores);
                updateLatestScores()
                loginStatus.innerText = ''
            })
            .catch(err => {
                loginStatus.innerText = err.errors[0];
            })
    });
}

function addActionToLogout() {
    document.querySelector('.main-div .logout  button').addEventListener('click', () => {
        // call service
        performLogout()
            .then(userInfo => {
                hideContent();
                showLogin();
            })
            .catch(err => {
                console.log(err);
            })
    });
}

function addActionToSortingRadioButton() {
    var sortingValues = document.getElementsByName('sort');
    for (var i = 0; i < sortingValues.length; i++) {
        sortingValues[i].onclick = function () {
            fetchLatestScores()
        }
    }

}

function updateLatestScores() {
    let timerId = setTimeout(function tick() {
        fetchLatestScores()
        timerId = setTimeout(tick, 5000); // (*)
    }, 5000);
}

// Adding event handler on X button calling DELETE API 
items.addEventListener('click', (e) => {
    // The below 'if' is making sure they clicked on the X
    // and not elsewhere in the list
    const username = document.getElementById("username").value
    const data = {
        'username': username
    }
    if (e.target.classList.contains('delete')) {
        const id = e.target.dataset.index;
        fetch(`/scores/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .catch(() => Promise.reject({ error: 'network-error' }))
            .then(convertError)
            .then(scores => {
                renderScores(scores);
                updateStatus('');

            })
            .catch(err => {
                console.log("error");
                updateStatus(errMsgs[err.error] || err.error);
            });
    }

});

//Adding event handler on ADD button and calling POST api for creating scores item
inputButton.addEventListener('click', () => {
    const name = inputElement.value;
    const username = document.getElementById("username").value
    const data = {
        'username': username
    }
    if (name) {
        fetch(`/scores/${name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .catch(() => Promise.reject({ error: 'network-error' }))
            .then(convertError)
            .then(scores => {
                renderScores(scores);
                inputElement.value = '';
                updateStatus('');

            })
            .catch(err => {
                updateStatus(errMsgs[err.error] || err.error);
            });
    }
});


//Adding event handler in items list on + button and calling PUT api for increasing the quantity by 1
items.addEventListener('click', (e) => {
    if (e.target.classList.contains('increase1')) {
        const id = e.target.dataset.index;
        const username = document.getElementById("username").value
        var body = {
            "scoreChange": 1,
            "username": username
        }
        fetch(`/scores/score/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .catch(() => Promise.reject({ error: 'network-error' }))
            .then(convertError)
            .then(score => {
                fetchLatestScores();
                updateStatus('');

            })
            .catch(err => {
                console.log("error");
                updateStatus(errMsgs[err.error] || err.error);
            });
    }

});



//Adding event handler in items list on - button and calling PUT api for decreasing the score by 1
items.addEventListener('click', (e) => {
    if (e.target.classList.contains('decrease1')) {
        const id = e.target.dataset.index;
        const username = document.getElementById("username").value
        var body = {
            'scoreChange': -1,
            'username': username
        }
        fetch(`/scores/score/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .catch(() => Promise.reject({ error: 'network-error' }))
            .then(convertError)
            .then(score => {
                fetchLatestScores();
                updateStatus('');
            })
            .catch(err => {
                console.log("error");
                updateStatus(errMsgs[err.error] || err.error);
            });
    }

});


function fetchLatestScores() {
    const username = document.getElementById("username").value
    fetch(`/scores/items/${username}`, {
        method: 'GET'
    })
        .catch(() => Promise.reject({ error: 'network-error' }))
        .then(convertError)
        .then(scores => {
            renderScores(scores);
            updateStatus('');

        })
        .catch(err => {
            console.log("error");
            updateStatus(errMsgs[err.error] || err.error);
        });
}

function disableButtonIfNoInput() {
    // Disable button if no text in input field
    inputElement.addEventListener('input', () => {
        inputButton.disabled = !inputElement.value;
        inputButton.classList.add('enabled-btn');

    });
}


function convertError(response) {
    if (response.ok) {
        return response.json();
    }
    return response.json()
        .then(err => Promise.reject(err));
}



//Rendering the UI using grid
function renderScores(scores) {

    var sortingValues = document.getElementsByName('sort');
    var sortingOrder = ""
    for (var i = 0, length = sortingValues.length; i < length; i++) {
        if (sortingValues[i].checked) {
            // Once radio button checked perform sorting
            sortingOrder = sortingValues[i].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    var orderedScores = []
    Object.entries(scores)
    if (sortingOrder === 'asc') {
        orderedScores = Object.entries(scores).sort((a, b) => (a[1].score - b[1].score))
    } else if (sortingOrder === 'desc') {
        orderedScores = Object.entries(scores).sort((a, b) => (b[1].score - a[1].score))
    } else {
        orderedScores = Object.entries(scores)
    }
    const html = orderedScores.map((item) => {
        return `
           <div class="grid-container">
              
                <div class="grid-item"><span class="item" data-index="${item[0]}">${item[1].name}</span></div>
                <div class="grid-item"><span class="delete" data-index="${item[0]}">X</span></div>
                <div class="grid-item"><span class="decrease1 ${item[1].score == 1 ? "disabled" : ''}"  data-index="${item[0]}">-</sapn></div>     
                <div class="grid-item"><span id="score"class="score" data-index="${item[0]}">${item[1].score}</span></div>
                <div class="grid-item"> <span class="increase1 ${item[1].score == 5 ? "disabled" : ''}" data-index="${item[0]}">+</span></div>
            </div>
          `;
    }).join('');

    items.innerHTML = html;
    inputButton.disabled = !inputElement.value;

};