async function main() {
    const tablesToSort = document.querySelectorAll('table[data-sort-table]');

    tablesToSort.forEach(table => new Tablesort(table));

    if (
        typeof location === 'object' &&
        typeof location.href === 'string' &&
        /\/crypt(\.html)(\?.*)?$/.test(location.href)
    ) {
        try {
            await cryptInit();
        } catch(error) {
            console.error(`error during cryptInit(): ${error}`, error);
        }
    }

    try {
        await cryptMountOnLinks();
    } catch(error) {
        console.error(`error during cryptMountOnLinks(): ${error}`, error);
    }
}

window.onload = function() {
    main().then();
};

async function cryptInit() {
    const queryParams = new URLSearchParams(window.location.search);
    const encJsonBase64Url = queryParams.get('encJsonBase64Url');
    const drawerSummaryElement = document.querySelector('#show-drawer');
    const decryptedMessageElement = document.querySelector('#decrypted-message');

    if (!encJsonBase64Url)
        return;
    
    const encJson = new TextDecoder().decode(Uint8Array.fromBase64(encJsonBase64Url));

    const keyBase64 = await cryptGetKeyBase64('keyBase64');

    if (!keyBase64)
        throw new Error(`error getting key: ${keyBase64}`);

    const dec = await (new SimpleCrypto(keyBase64).decrypt(encJson));

    decryptedMessageElement.innerText = dec;
    drawerSummaryElement.innerText = 'Show';
    window.history.replaceState({}, document.title, location.href.split('?')[0]);
}

async function cryptMountOnLinks() {
    const linkRegex = /\/crypt\.html\?encJsonBase64Url=([A-Za-z0-9\+\/=]+)&cryptEnd/;
    const linkElements = document.querySelectorAll('a');

    if (!linkElements)
        return;

    linkElements.forEach(linkElement => {
        let match;
        
        if (match = linkRegex.exec(linkElement.href)) {
            const origHref = linkElement.href;
            const encJsonBase64Url = match[1];

            console.info(`detected crypt link`, {encJsonBase64Url: encJsonBase64Url});
            
            linkElement.addEventListener('click', async () => {
                console.info('user clicked on encrypted link. trying to decrypt all links.');

                try {
                    await cryptDecryptAllLinks();
                } catch(error) {
                    console.error(`error during cryptDecryptAllLinks(): ${error}`, error);
                }
            });

            linkElement.dataset.encJsonBase64Url = encJsonBase64Url;
            linkElement.href = '#';
        }
    });
}

async function cryptDecryptAllLinks() {
    const linkElements = document.querySelectorAll('a');

    if (!linkElements)
        return;

    const keyBase64 = await cryptGetKeyBase64('keyBase64');
            
    if (!keyBase64)
        throw new Error(`error getting key: ${keyBase64}`);

    const sc = new SimpleCrypto(keyBase64);
    
    linkElements.forEach(async (linkElement) => {
        try {
            const encJsonBase64Url = linkElement.dataset.encJsonBase64Url;

            if (!encJsonBase64Url)
                return;
            
            const encJson = new TextDecoder().decode(Uint8Array.fromBase64(encJsonBase64Url));
            
            
            const dec = await (sc.decrypt(encJson));
    
            linkElement.innerText = dec;
        } catch(error) {
            console.error(`error decrypting link: ${error}`, error);
        }
    });
}

async function cryptGetKeyBase64(keyName) {
    const lsKey = localStorage.getItem(keyName);

    if (!!lsKey && lsKey !== 'null' && lsKey !== 'undefined' && lsKey !== '')
        return lsKey;

    localStorage.removeItem(keyName);

    const key = window.prompt(`${keyName}: `);

    if (!!key)
        localStorage.setItem(keyName, key);

    return key;
}

class SimpleCrypto {
    #version = 1;
    #encAlgo = 'AES-GCM';
    #cryptoApi
    #key;

    constructor(keyBase64) {
        this.#key = keyBase64;
    }

    async decrypt(encJson) {
        const cryptoApi = window.crypto;
        
        const binKey = Uint8Array.fromBase64(this.#key);
        const keyCrypto = await cryptoApi.subtle.importKey("raw", binKey, this.#encAlgo, true, ["encrypt", "decrypt"]);

        const encObj = JSON.parse(encJson);

        if (encObj.v !== this.#version)
            throw new Error(`error: wrong version. this class is v${this.#version}, and the object: ${encObj.v}`);

        const ivBin = Uint8Array.fromBase64(encObj.iv);
        const encBin = Uint8Array.fromBase64(encObj.enc);
        const decBin = await cryptoApi.subtle.decrypt(
            {name: this.#encAlgo, iv: ivBin},
            keyCrypto,
            encBin
        );
        
        return new TextDecoder().decode(decBin);
    }
}
