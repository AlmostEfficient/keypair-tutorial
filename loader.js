// This file shows all the different ways to create a keypair
// - From a secret phrase
// - From a byte array
// - From a secret key
// - From Base58 encoded string

import * as bip39 from 'bip39';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();

// Load from a secret/seed phrase, looks like this:
// upset tobacco female muscle adjust custom false dumb now limb huge lift
const nmemonic = process.env.SECRET_PHRASE;
const seed = bip39.mnemonicToSeedSync(nmemonic).slice(0, 32);
const seedPhraseKeypair = Keypair.fromSeed(seed);
console.log('Seed phrase pubkey is', seedPhraseKeypair.publicKey.toBase58());

// Load from Byte Array, looks like:
// [118,155,215,241,221,75,201,92,172,50,182,68,186,90,105,110,241,188,207,117,228,160,38,64,63,10,227,123,196,103,29,25,144,42,171,36,164,208,233,242,226,228,90,183,75,225,220,73,246,78,0,59,76,156,227,69,199,189,184,159,83,188,130,135]
const byteArray = JSON.parse(process.env.BYTE_ARRAY);
const byteArraySecretKey = Uint8Array.from(byteArray);
const byteArrayKeypair = Keypair.fromSecretKey(byteArraySecretKey);
console.log('Byte array pubkey is', byteArrayKeypair.publicKey.toBase58());

// Load from base58 encoded string, looks like this:
// 2hCfbzMz97kw1vZ93bLNpK9dHQibdaBVmnPC3ZNh6RYqGbienaqGHF8SAV1jw2NiLA8Fr3vh3KKTkcrj3mx4QwXK
const base58String = process.env.BASE58_STRING;
const base58SecretKey = bs58.decode(base58String);
const base58Keypair = Keypair.fromSecretKey(base58SecretKey);
console.log('Base58 string pubkey is', base58Keypair.publicKey.toBase58());

// Load from hexadecimal string, looks like this:
// 4f590dfadb4ed0126e11ebc1ca4117e39482f5dfc5446a743845921c1b2dee9cf739a2ee291c058b1707243c2bb86ce18881a287880272ab965d9436b94567c3 
const hexString = process.env.HEX_STRING; // Load from environment variable or replace with actual string
const hexStringSecretKey = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
const keypairFromHex = Keypair.fromSecretKey(hexStringSecretKey);
console.log('Public Key from Hex:', keypairFromHex.publicKey.toBase58());

// Check that the public keys for all the keypairs match
// They should all be the same


// const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
