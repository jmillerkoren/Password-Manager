import AES from "crypto-js/aes"
import Utf8 from "crypto-js/enc-utf8"

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    chrome.storage.local.get(['access_token', 'vault_key'], function(result) {
        console.log(result);
        fetch(`http://localhost:8000/api/v1/vault/vault_item/?url=${encodeURIComponent(request.url)}`,
            {
                method: 'GET',
                headers: {'Authorization': result['access_token'], 'Content-Type': 'application/json'},
            })
            .then(response => response.json())
            .then(data => {
                if (request.type === 'password') {
                    data.password = decryptPassword(data.password, result['vault_key']).toString(Utf8);
                    sendResponse({input: data.password});
                }
                else {
                    sendResponse({input: data.username})
                }
            })
            .catch(error => console.log(error))
    });
    return true;
});

function decryptPassword(encryptedPass, key) {
    let password = AES.decrypt(encryptedPass, key);
    return password;
}
