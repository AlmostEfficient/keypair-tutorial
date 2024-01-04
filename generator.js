import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import bs58 from 'bs58';
import fs from 'fs';

// Generate a new mnemonic (seed phrase)
const mnemonic = bip39.generateMnemonic();
console.log('Mnemonic (Seed Phrase):', mnemonic);

// Convert the mnemonic to a seed
const seed = await bip39.mnemonicToSeed(mnemonic);

const seedBytes = seed.slice(0, 32); // Use the first 32 bytes
const keypair = Keypair.fromSeed(seedBytes);

// Extracting the secret key
const secretKey = keypair.secretKey;
console.log('Secret Key Uint8Array:', secretKey);

// Converting the private key to a base58 string
const base58PrivateKey = bs58.encode(keypair.secretKey);
console.log('base58 PK: ' + base58PrivateKey);

// The secret key is a Uint8Array, you might want to convert it to a more readable format
// such as a hexadecimal string for display or storage purposes
const secretKeyHex = Array.from(secretKey)
  .map((byte) => byte.toString(16).padStart(2, '0'))
  .join('');
console.log('Secret Key Hexadecimal:', secretKeyHex);

const filePath = '.env';

if (fileExists(filePath)) {
  fs.unlinkSync(filePath);
  console.log(`Old ${filePath} has been deleted.`);
}

appendToEnvFile('SECRET_PHRASE', mnemonic);
appendToEnvFile('BYTE_ARRAY', JSON.stringify(Array.from(secretKey)));
appendToEnvFile('BASE58_STRING', base58PrivateKey);
appendToEnvFile('HEX_STRING', secretKeyHex);

console.log('Values written to .env file');
console.log('Public Key:', keypair.publicKey.toBase58());

// File Helpers
// Write all of these values to a .env file
function appendToEnvFile(key, value) {
  fs.appendFileSync('.env', `\n${key}=${value}`);
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
}
