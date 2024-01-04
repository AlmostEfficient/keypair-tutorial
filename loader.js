import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import * as bip39 from 'bip39';
import bs58 from 'bs58';
import dotenv from 'dotenv';
dotenv.config();

// Load from a secret/seed phrase
const nmemonic = process.env.SECRET_PHRASE;
const seed = bip39.mnemonicToSeedSync(nmemonic).slice(0, 32);
const seedPhraseKeypair = Keypair.fromSeed(seed);

// Load from Byte Array
const byteArray = JSON.parse(process.env.BYTE_ARRAY);
const byteArraySecretKey = Uint8Array.from(byteArray);
const byteArrayKeypair = Keypair.fromSecretKey(byteArraySecretKey);

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
