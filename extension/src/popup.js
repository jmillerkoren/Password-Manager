import sha256 from "../node_modules/crypto-js/sha256"

let state = {
    loggedIn: false
};

let proxyState = new Proxy(state, {
    set: function(target, key, value) {
        console.log("state has changed");
        displayLoggedout();
        return true;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let loginButton = document.getElementById("login-button");
    loginButton.addEventListener("click", async () => {
        await submitCredentials();
    });
});

chrome.storage.local.get('access_token', function(data) {
    if (data.hasOwnProperty('access_token')) {
        displayLoggedin();
    }
});

async function submitCredentials() {
    let email =  document.getElementById("email").value;
    let password =  document.getElementById("password").value;
    if (email == "" || password == "") {
        return;
    }
    let vault_key = calculateHash(email + password);
    let auth_key = calculateHash(password + vault_key);
    let response = await makeRequest(
        "http://localhost:8000/api/v1/login/login_user_extension/",
        "POST",
        {'Content-Type': 'application/json'},
        JSON.stringify({email: email, auth_key: auth_key}));
    if (response.status == 200) {
        chrome.storage.local.set({'access_token': response.headers.get('Authorization'), 'vault_key': vault_key}, () => {
            displayLoggedin();
        });
    }
}

async function makeRequest(url, method, headers, body) {
    console.log(body);
    const response = await fetch(url, {
        method: method,
        headers: headers,
        body: body,
        credentials: 'include'
    });
    return response;
}

const calculateHash = (message) => {
    for (let i = 0; i < 5000; ++i) {
        message = sha256(message).toString();
    }
    return message;
};

function displayLoggedin() {
    let root = document.getElementById('extension');
    let loginForm = document.getElementById('login-form');
    let logoutButton = document.createElement("button");
    let container = document.createElement("div");
    container.classList.add('container2');
    container.id = 'buttonContainer';
    logoutButton.id = 'logout';
    logoutButton.classList.add('button');
    logoutButton.innerText = "Log Out";
    logoutButton.addEventListener("click", function () {
        chrome.storage.local.remove("access_token");
        proxyState.loggedIn = false;
    });
    container.appendChild(logoutButton)
    root.replaceChild(container, loginForm);
}

function displayLoggedout() {
    let root = document.getElementById('extension');
    let logoutButtonContainer = document.getElementById('buttonContainer');
    let form = document.createElement('form');
    form.classList.add('login-form');
    form.classList.add('container');
    form.id = 'login-form';
    let inputUsername = document.createElement('input');
    inputUsername.text = 'text';
    inputUsername.id = 'email';
    inputUsername.placeholder = 'email';
    let inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.id = 'password';
    inputPassword.placeholder = 'password';
    let submit = document.createElement('input');
    submit.addEventListener('click', async () => {
        await submitCredentials()
    });
    submit.type = 'button';
    submit.value = 'Login';
    form.appendChild(inputUsername);
    form.appendChild(inputPassword);
    form.appendChild(submit);
    root.replaceChild(form, logoutButtonContainer);
}
