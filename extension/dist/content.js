findInputs()

let observer = new MutationObserver(function () {
    console.log("mutation observed");
    findInputs();
})

let config = {childList: true, subtree: true}
observer.observe(document.body, config);

function getCredentials(url, type, inputNode) {
    chrome.runtime.sendMessage({url: url, type: type}, function(response) {
        inputNode.value = response.input;
    })
}

function findInputs() {
    if (document.body.contains(document.querySelector('input[type=text]'))) {
        let textInput = document.querySelector('input[type=text]')
        if (textInput.id === 'username' || textInput.id === 'email') {
            getCredentials(location.href, 'text', textInput);
        }
    }

    if (document.body.contains(document.querySelector('input[type=email]'))) {
        getCredentials(location.href, 'email', document.querySelector('input[type=email]'));
    }

    if (document.body.contains(document.querySelector('input[type=password]'))) {
        getCredentials(location.href, 'password', document.querySelector('input[type=password]'));
    }
}
