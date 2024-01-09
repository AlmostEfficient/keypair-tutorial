import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import * as ed25519 from 'ed25519-hd-key';
import bs58 from 'bs58';
import dotenv from 'dotenv';
dotenv.config();

// Load from a secret/seed phrase
const mnemonic = process.env.SECRET_PHRASE;
const seed = bip39.mnemonicToSeedSync(mnemonic).slice(0, 32);

// You can create a keypair directly from the mnemonic by converting it into a seed
const seedPhraseKeypair = Keypair.fromSeed(seed);

/*
Convert the seed asynchronously so that you can perform other tasks while the seed is being generated. When to do this: generating a seed phrase in a web browser, or an API server that needs to handle multiple requests at the same time

const seed = bip39.mnemonicToSeed(mnemonic); 
*/

// Alternatively, to create a keypair using a custom derivation path
// Define the derivation path
const path = `m/44'/501'/0'/0'`; // Replace with your custom path
// Derive a seed from the given path
const derivedSeed = ed25519.derivePath(path, Buffer.from(seed, 'hex')).key;
// Generate a keypair from the derived seed using tweetnacl (NaCl = Networking and Cryptography library)
const derivedUint8Keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
// This is a Uint8Array, not a Solana web3.js Keypair object, so you will need to convert it
const customPathKeypair = Keypair.fromSecretKey(
  Uint8Array.from(derivedUint8Keypair.secretKey)
);

// Load from Byte Array
const byteArray = JSON.parse(process.env.BYTE_ARRAY);
const byteArraySecretKey = Uint8Array.from(byteArray);
const byteArrayKeypair = Keypair.fromSecretKey(byteArraySecretKey);
// console.log('Public key from byteArrayKeypair:', byteArrayKeypair.publicKey.toBase58());

// Load from base58 encoded string
const base58String = process.env.BASE58_STRING;
const base58SecretKey = bs58.decode(base58String);
const base58Keypair = Keypair.fromSecretKey(base58SecretKey);

// Load from hexadecimal string
const hexString = process.env.HEX_STRING;
const hexStringSecretKey = new Uint8Array(
  hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
);
const keypairFromHex = Keypair.fromSecretKey(hexStringSecretKey);

// Check that the public keys for all the keypairs match
// This is done to verify that the keypairs were loaded correctly
const arePublicKeysSame =
  seedPhraseKeypair.publicKey.toBase58() ===
    byteArrayKeypair.publicKey.toBase58() &&
  byteArrayKeypair.publicKey.toBase58() ===
    base58Keypair.publicKey.toBase58() &&
  base58Keypair.publicKey.toBase58() === keypairFromHex.publicKey.toBase58();

console.log('Do all public keys match?', arePublicKeysSame);

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Load any of the keypairs and check the balance
console.log(
  'Account Balance:',
  await connection.getBalance(keypairFromHex.publicKey)
);
