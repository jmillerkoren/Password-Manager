window.addEventListener('message', recieveMessage, false)

function recieveMessage(evt) {
    removeCredentials();
    credentialsList(evt.data.credentials, evt.data.id);
}

function credentialsList(credentials, id) {
    let container = document.getElementById('credentials-list')
    credentials.forEach(function (credential) {
        credentialCard(container, credential, id);
    })
}

function credentialCard(container, credential, id) {
    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.classList.add('list-group-hover');
    listItem.style.textAlign = 'center';
    listItem.innerText = credential.username;
    listItem.addEventListener('click', () => {
        window.parent.postMessage({id: id, username: credential.username}, '*');
    })
    container.appendChild(listItem);
}

function removeCredentials() {
    let credentialsList = document.getElementById('credentials-list');
    let creds = credentialsList.children;
    console.log(creds.length);
    for(i = 0; i < creds.length; i++) {
        creds[i].remove();
    }
}
