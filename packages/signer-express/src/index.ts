import {
  generateKeyPair,
  listKeys,
  removeKeyPair,
  sign
} from '@a4smanjorg5/invoida'
import express from 'express'
import { AddressInfo } from 'net'

const app = express()

app.set('json spaces', 4)
app.enable('json escape')

app.use((req, res, next) => {
  const url = req.headers.origin && new URL(req.headers.origin)
  if (url && url.hostname == 'localhost') {
    if (req.headers['access-control-request-headers']) {
      res.header('Access-Control-Allow-Headers', '*')
    }
    res.header('Access-Control-Allow-Origin', url.origin)
  }
  next()
})

app.delete('/certs/:kid', (req, res, next) => {
  removeKeyPair(req.params.kid)
    .then(() => res.end())
    .catch(() => next())
  res.statusCode = 204
})

app.get('/certs', async (_, res) => {
  const certs = { keys: await listKeys() }

  if (certs.keys.length) {
    res.attachment().json(certs)
  } else {
    res.json(certs)
  }
})

app.post('/certs', (req, _, next) => {
  req.body = ''
  req.on('data', d => req.body += d)
  req.on('end', next)
}, async (req, res) => {
  res.attachment('pubkey.json').json(await generateKeyPair(req.body))
})

app.post('/sign/:kid', (req, _, next) => {
  const chunks: Uint8Array[] = []
  req.on('data', d => chunks.push(d))
  req.on('end', () => {
    const data = Buffer.concat(chunks)
    try {
      req.body = JSON.parse(data + '')
    } catch { }
    next()
  })
}, async (req, res, next) => {
  try {
    const s = await sign(req.query.iss ? { iss: req.query.iss, ...req.body } : req.body, req.params.kid)
    if (typeof req.body == 'object') {
      res.end(s)
    } else {
      res.status(400).json({ reason: 'Required type of input must JSON object' })
    }
  } catch {
    next()
  }
})

const server = app.listen(Math.floor(+process.env.PORT! || 0), 'localhost', () => {
  console.log('url> http://localhost:' + (server.address() as AddressInfo).port)
})
