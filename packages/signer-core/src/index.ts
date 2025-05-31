import { glob } from 'glob'
import {
  CompactSign,
  type JWK,
  exportJWK,
  exportPKCS8,
  generateKeyPair as genKp,
  importPKCS8,
} from 'jose'
import { randomBytes } from 'crypto'
import { mkdir, readFile, unlink, writeFile } from 'fs/promises'
import { join } from 'path'

const BUFFER_SIZE = Math.max(+process.env.INVOIDA_KIDSZ!, 8) || 8

const encodeObj = (obj: object) => new Uint8Array(
  Buffer.from(JSON.stringify(obj).replace(/[^\x00-\xff]/g, char => (
    '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')
  )))
)

/**
 * Generates a new ES256 key pair and saves both the public JWK and private PEM to the filesystem.
 *
 * @param {string} [kid] - Optional key ID. If not provided, a random one will be generated.
 * @returns {Promise<JWK>} A promise that resolves to the public JWK with the key ID.
 */
export const generateKeyPair = async (kid?: string) => {
  const { privateKey, publicKey } = await genKp('ES256')
  const jwk = await exportJWK(publicKey)

  jwk.kid = kid || randomBytes(BUFFER_SIZE).toString('base64url')
  await mkdir(pathToKeysDir(''), { recursive: true }).catch()
  await Promise.all([
    writeFile(pathToKeysDir(jwk.kid + '.jwk'), JSON.stringify(jwk)),
    writeFile(pathToKeysDir(jwk.kid + '.pem'), await exportPKCS8(privateKey)),
  ])

  return jwk
}

/**
 * Lists all saved public JWK keys from the filesystem.
 *
 * @returns {Promise<JWK[]>} A promise that resolves to an array of JWKs.
 */
export const listKeys = async () => Promise.all(
  (await glob(pathToKeysDir('*.jwk'), { windowsPathsNoEscape: true })).map(
    async path => JSON.parse('' + await readFile(path)) as JWK
  )
)

/**
 * Removes both the PEM and JWK files associated with the given key ID from the filesystem.
 *
 * @param {string} kid - The key ID whose files should be removed.
 * @returns {Promise<void>} A promise that resolves once both files have been deleted.
 */
export const removeKeyPair = (kid: string) => Promise.all([
  unlink(pathToKeysDir(kid + '.pem')),
  unlink(pathToKeysDir(kid + '.jwk')),
]).then(arr => arr[0])

/**
 * Signs a payload using the private key associated with the given key ID (kid).
 *
 * @template T
 * @param {Record<string, T>} payload - The payload to sign.
 * @param {string} kid - The key ID of the signing key.
 * @returns {Promise<string>} A promise that resolves to the compact JWS (JSON Web Signature) string.
 */
export const sign = async <T>(payload: Record<string, T>, kid: string) =>
  new CompactSign(encodeObj({ iat: Date.now(), ...payload }))
  .setProtectedHeader({ alg: 'ES256', kid })
  .sign(await importPKCS8('' + await readFile(pathToKeysDir(kid + '.pem')), 'ES256'))

const pathToKeysDir = (...paths: string[]) => join(process.env.INVOIDA_CERTS_DIR!, ...paths)
