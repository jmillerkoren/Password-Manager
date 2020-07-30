let credentials = []

window.addEventListener('message', function (evt) {
    console.log(evt)
    if (evt.origin === 'chrome-extension://' + chrome.runtime.id) {
        console.log(evt);
    }
})

findForms()

let observer = new MutationObserver(function () {
    if (document.getElementById('fppopupuser') || document.getElementById('fppopuppass')) {
        return
    }
    findForms()
})

let config = {childList: true, subtree: true}
observer.observe(document.body, config);

function getCredentials(url, id) {
    let popupiframe = document.getElementById(id)
    if (popupiframe.classList.contains('show')) {
        togglePopup(id)
    }
    else {
        chrome.runtime.sendMessage({url: url}, function(response) {
            if (response == undefined) {
                credentials = [];
                createCredentialsList(popupiframe);
            }
            else {
                credentials = response;
                createCredentialsList(popupiframe);
                togglePopup(id)
            }
        })
    }
}

function findForms() {
    let forms = document.querySelectorAll('form')
    if (forms.length > 0) {
        forms.forEach(function(form) {
            if (typeof(form.action) === "string" && form.action != "") {
                console.log(form.action)
                if (form.action.includes("login") || form.action.includes("sign-ine")) {
                    console.log('lax');
                    findInputLax(form);
                }
            }
            else {
                findInputs(form);
            }

        })
    }
}

function findInputs(form) {
    if (form.contains(document.querySelector('input[type=text]'))) {
        let textInput = document.querySelector('input[type=text]')
        if (textInput.id.includes('user') || textInput.id.includes('email') || textInput.id.includes('login')) {
            addButton(textInput)
        }
    }

    if (form.contains(document.querySelector('input[type=email]'))) {
        addButton(document.querySelector('input[type=email]'))
    }

    if (form.contains(document.querySelector('input[type=password]'))) {
        addButton(document.querySelector('input[type=password]'))

    }
}

function findInputLax(form) {
    if (form.contains(document.querySelector('input[type=text]'))) {
        console.log('text found');
        let textInput = document.querySelector('input[type=text]')
        //getCredentials(location.href, 'text', textInput);
        addButton(textInput)
    }

    if (form.contains(document.querySelector('input[type=email]'))) {
        //getCredentials(location.href, 'email', document.querySelector('input[type=email]'));
        addButton(document.querySelector('input[type=email]'))
    }

    if (form.contains(document.querySelector('input[type=password]'))) {
        //getCredentials(location.href, 'password', document.querySelector('input[type=password]'));
        addButton(document.querySelector('input[type=password]'))
    }
}

function addButton(input) {
    input.addEventListener('mousemove', handleInputEvents)
    input.addEventListener('click', handleInputEvents);
    input.autocomplete = 'off';
    input.style.backgroundImage = `url(${chrome.runtime.getURL('lock.svg')})`;
    input.style.backgroundSize = '16px 18px';
    input.style.backgroundPosition = '98% 50%';
    input.style.backgroundRepeat = 'no-repeat';
    input.style.backgroundColor = 'transparent';
    createPopup(input, input.type);
}

function handleInputEvents(evt) {
    let rect = evt.target.getBoundingClientRect()
    let mx = evt.clientX - rect.left;
    let my = evt.clientY - rect.top;
    let y = ((rect.bottom - rect.top) - 18) / 2;
    let x = (0.05 * (rect.right - rect.left)) - 8;
    let tleft = {x: (rect.right - rect.left) - (x + 16), y: y};
    let bright = {x: tleft.x + 16, y: tleft.y + 18};
    let inside = insideIcon(tleft, bright, {x: mx, y: my});
    if (evt.type === 'mousemove') {
        if (inside) {
            evt.target.style.cursor = 'pointer';
        }
        else {
            evt.target.style.cursor = 'text'
        }
    }
    if (evt.type === 'click') {
        if (inside) {
            let id = getType(evt.target)
            getCredentials(location.href, id);
        }
    }
}

function insideIcon(tleft, bright, pointer) {
    if ((pointer.x >= tleft.x && pointer.x <= bright.x) &&
        (pointer.y >= tleft.y && pointer.y <= bright.y)) {
        return true;
    }
    return false;
}

function createPopup(input, inputType) {
    let boundingRect = input.getBoundingClientRect();
    let iframe = document.createElement('iframe');
    iframe.onload = function() {
        //iframe.width = iframe.contentWindow.document.body.scrollWidth
        //iframe.height = iframe.contentWindow.document.body.scrollHeight
        iframe.width = '292px';
        iframe.height = '150px';
    };
    iframe.src = chrome.runtime.getURL('inputPopup.html');
    if(inputType === 'text'  || inputType === 'email') {
        iframe.id = 'fppopupuser';
    }
    if(inputType === 'password') {
        iframe.id = 'fppopuppass';
    }
    iframe.classList.add('popup');
    iframe.style.position = 'absolute';
    iframe.style.zIndex = '1000000';
    iframe.style.left = `${boundingRect.right}px`;
    iframe.style.top = `${boundingRect.bottom}px`;
    document.body.appendChild(iframe);
}

function createCredentialsList(popupDiv) {
    console.log(credentials);
    popupDiv.contentWindow.postMessage(credentials, '*');
}

function togglePopup(inputType) {
    let popup = document.getElementById(inputType);
    popup.classList.toggle('show');
}

function getType(input) {
    if (input.type === 'email' || input.type === 'text') {
        return 'fppopupuser';
    }
    return 'fppopuppass';
}


