# @a4smanjorg5/invoida
> Core signing and cryptographic module for the Invoida project 

This module provides utilities to generate and manage cryptographic keys and sign JSON-based document payloads using ES256 and JWT.

---

## Features

- Generate secure ES256 key pairs
- Store public keys as JWK and private keys as PEM
- Sign JWT payloads
- List and delete keys from disk
- Supports both ESM and CJS environments

## Installation

```bash
npm install @a4smanjorg5/invoida
# or
yarn add @a4smanjorg5/invoida
```

## Environment Setup

```env
INVOIDA_CERTS_DIR=./certs
```
> Make sure the directory set in `INVOIDA_CERTS_DIR` can be created

## Output

Keys are saved to the directory specified by `INVOIDA_CERTS_DIR`:
- `{kid}.jwk` &rarr; Public key in JWK format
- `{kid}.pem` &rarr; Private key in PEM format

## License
MIT &copy; a4smanjorg5
