import sha256 from "../node_modules/crypto-js/sha256"

document.addEventListener("DOMContentLoaded", () => {
    let loginButton = document.getElementById("login-button");
    loginButton.addEventListener("click", async () => {
        await submitCredentials();
    });
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
        makeCookie('http://developer.chrome.com/extensions/popup.html', 'access_token', 60, response.headers.get('Authorization'));
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

function makeCookie(url, name, expDay, value) {
    let expDate = new Date();
    expDate.setDate(expDate.getDate() + expDay);
    let expDateSeconds =expDate.getTime() / 1000;
    chrome.cookies.set({'url': url, 'name': name, 'expirationDate': expDateSeconds, 'value': value}, () => {
        console.log("cookie set");
    })
}


