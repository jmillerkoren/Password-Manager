window.addEventListener('message', recieveMessage, false)
window.addEventListener('DOMContentLoaded', function (evt) {
    window.parent.postMessage({width: document.body.clientWidth}, '*');
})

function recieveMessage(evt) {
    credentialsList(evt.data);
}

function credentialsList(credentials) {
    let container = document.getElementById('credentials-list')
    credentials.forEach(function (credential) {
        credentialCard(container, credential);
    })
}

function credentialCard(container, credential) {
    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.classList.add('list-group-hover');
    listItem.style.textAlign = 'center';
    listItem.innerText = credential.username;
    container.appendChild(listItem);
}
