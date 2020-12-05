const bInt = require('big-integer');

function gcd(firstNum, secondNum) {
    if (!secondNum) {
        return firstNum;
    }
    return gcd(secondNum, firstNum % secondNum);
}
function isPrime(num) {
    for (let i = 2; i < num; i++) if (num % i === 0) return false;
    return num > 1;
}

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function generatePrimeNumber() {
    let isFound = false;
    let candidate = getRandom(200, 400);

    while (!isFound) {
        if (isPrime(candidate) && candidate % 4 == 3) {
            isFound = true;
        } else {
            candidate++;
        }
    }
    return candidate;
}


function getRelativelyPrimeNumber(relative) {
    let number = generatePrimeNumber();
    while (gcd(number, relative) !== 1) {
        number = generatePrimeNumber();
    }
    return number;
}

function generateKeys() {
    const p = generatePrimeNumber();
    const q = generatePrimeNumber();
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const e = getRelativelyPrimeNumber(phi);
    const d = getD(e, phi);
    return {
        privateKey: { d, n },
        publicKey: { e, n }
    }

}
function stringToNumbersArr(string) {
    return string.split("").map(char => char.charCodeAt(0))
}

function numbersArrToString(arr) {
    return arr.map(number => String.fromCharCode(number)).join("");
}

function decryptMessage(msg, publicKey) {
    return bInt(msg).pow(publicKey.e).mod(publicKey.n)
}

function encryptMessage(decMsg, privateKey) {
    return bInt(decMsg).pow(privateKey.d).mod(privateKey.n)
}

function getD(e, phi) {
    e = e % phi;
    for (let x = 1; x < phi; x++)
        if ((e * x) % phi == 1)
            return x;
}


function decryptString(string, publicKey) {
    const numbersArr = stringToNumbersArr(string);
    return numbersArr.map(msg => decryptMessage(msg, publicKey))
}

function encryptString(decryptedNumbersArr, privateKey) {
    const encryptedNumbersArr = decryptedNumbersArr.map(msg => encryptMessage(msg, privateKey));
    return numbersArrToString(encryptedNumbersArr);
}

(function main() {
    const keys = generateKeys();
    const msg = 'Lorem ipsum dolor sit amet, consectetuer adipiscin'
    console.log('msg -> ' + msg);
    const decryptedMessage = decryptString(msg, keys.publicKey);
    console.log('decryptedMessage -> ' + decryptedMessage);
    const encryptedMessage = encryptString(decryptedMessage, keys.privateKey)
    console.log('encryptedMessage -> ' + encryptedMessage);
})();


