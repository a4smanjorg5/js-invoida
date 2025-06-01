# signer-express
This module provides app to generate and manage cryptographic keys and sign JSON-based document payloads using ES256 and JWT.

---

## Usage

```bash
npm i
npm build
npm start
# or
yarn
yarn build
yarn start
```

You can only use `npm start` or `yarn start` if already above.

## Environment Setup

```env
PORT=
INVOIDA_CERTS_DIR=./certs
```
> Random port will be generated if not provided. Also see [@a4smanjorg5/invoida](../signer-core) for more info

## Output

Keys are saved to the directory specified by `INVOIDA_CERTS_DIR`:
- `{kid}.jwk` &rarr; Public key in JWK format
- `{kid}.pem` &rarr; Private key in PEM format

## License
MIT &copy; a4smanjorg5
