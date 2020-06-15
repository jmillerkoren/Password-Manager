if (document.body.contains(document.querySelector('input[type=text]'))
    && document.body.contains(document.querySelector('input[type=password]'))) {
    getCredentials(location.href);

}

let observer = new MutationObserver(function () {
    if (document.body.contains(document.querySelector('input[type=text]'))
        && document.body.contains(document.querySelector('input[type=password]'))) {
        console.log('inputs were found');
    }
})

let config = {childList: true, subtree: true}
observer.observe(document.body, config);

function getCredentials(url) {
    chrome.runtime.sendMessage({url: url}, function(response) {
        console.log(response.data.username)
        let textInput = document.querySelector('input[type=text]')
        textInput.value = response.data.username
        let passwordInput = document.querySelector('input[type=password]')
        passwordInput.value = response.data.password
    })
}




