#!/usr/bin/env node

import process from 'node:process';
import os from 'node:os';
import fs from 'node:fs';
import crypto from 'node:crypto';

async function main() {
    const args = process.argv.slice(2);

    if (args.length !== 1) {
        printUsage();
        process.exitCode = 1;
        return;
    }

    const textToEncrypt = args[0];
    const keyBase64 = fs.readFileSync(os.homedir() + '/.crypt-secret-1-nikthinkNet', 'utf-8');
    
    const encJson = await encryptV1_1(keyBase64, textToEncrypt);
    const encJsonBase64 = await (new TextEncoder().encode(encJson).toBase64({alphabet: 'base64url'}));

    process.stdout.write(`/crypt.html?encJsonBase64Url=${encJsonBase64}&cryptEnd\n`);
}

function printUsage() {
    process.stderr.write(`usage:\n`);
    process.stderr.write(`\tenc.mjs TEXT_TO_ENCRYPT\n`);
}

async function encryptV1_1(keyBase64, message) {
    const version = 1;
    const encAlgo = 'AES-GCM';
    const cryptoApi = crypto;

    message = message.padEnd(Math.ceil(message.length / 100) * 100);
    
    const binKey = Uint8Array.fromBase64(keyBase64);
    const keyCrypto = await cryptoApi.subtle.importKey("raw", binKey, encAlgo, true, ["encrypt", "decrypt",]);
    
    const ivBin = cryptoApi.getRandomValues(new Uint8Array(12));
    const encBin = await cryptoApi.subtle.encrypt(
        {name: encAlgo, iv: ivBin},
        keyCrypto,
        new TextEncoder().encode(message)
    );
    const encBase64 = await (new Uint8Array(encBin).toBase64());
    const ivBase64 = await (new Uint8Array(ivBin).toBase64());

    return JSON.stringify({v: version, iv: ivBase64, enc: encBase64});
}

async function encryptV1(keyBase64, message) {
    const version = 1;
    const encAlgo = 'AES-GCM';
    const cryptoApi = crypto;
    
    const binKey = Uint8Array.fromBase64(keyBase64);
    const keyCrypto = await cryptoApi.subtle.importKey("raw", binKey, encAlgo, true, ["encrypt", "decrypt",]);
    
    const ivBin = cryptoApi.getRandomValues(new Uint8Array(12));
    const encBin = await cryptoApi.subtle.encrypt(
        {name: encAlgo, iv: ivBin},
        keyCrypto,
        new TextEncoder().encode(message)
    );
    const encBase64 = await (new Uint8Array(encBin).toBase64());
    const ivBase64 = await (new Uint8Array(ivBin).toBase64());

    return JSON.stringify({v: version, iv: ivBase64, enc: encBase64});
}

main().then();
