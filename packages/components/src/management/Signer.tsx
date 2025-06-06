import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@genrwork/reactstrap/Button'
import Modal from '@genrwork/reactstrap/Modal'
import classNames from 'classnames'
import QRCode from 'qrcode'
import YAML from 'yaml'
import styles from '../../styles/main.module.scss'
import { TextInput } from '../components/Input'
import YJPTextArea from '../components/YJPTextArea'
import { useAppVariables } from '../contexts/app'
import { useHistory } from '../contexts/history'
import { useSectionName } from '../contexts/section'
import { useTransition } from '../contexts/transition'
import { Mutation } from '../helpers'
import HttpAct from './HttpAct'
import { type SignRequest } from './helpers'

type STATE_TYPE = 'mSign'

const Signer = () => {
  const stateType = useSectionName() as STATE_TYPE
  const [{ feedback }, pushState] = useHistory(stateType)
  const [issuer, setIssuer] = useState('')
  const [kid, setKid] = useState('')
  const self = useAppVariables()

  const inputRef = useRef<HTMLInputElement>(null)
  const listenFn = useTransition(stateType)

  useEffect(() => {
    listenFn({
      onEntering: () => {
        inputRef.current?.focus()
      }
    })
  }, [listenFn])

  const params = useMemo(() => ({ kid, issuer }), [kid, issuer])

  const showJWT = async (jwt: string) => {
    const url = URL.createObjectURL(await drawQR(jwt).then(canvas2blob))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'jwToken'
    anchor.click()
    if (self.signImg) {
      URL.revokeObjectURL(self.signImg)
    }
    self.signImg = url
    pushState({ feedback: { jwt, url } }, false)
  }

  const transform = ({ format, payload }: SignRequest) => {
    switch (format) {
      case 'yaml':
        return YAML.parse(payload)
      case 'json':
        return JSON.parse(payload)
    }

    return { text: payload }
  }

  return (
    <>
      <TextInput
        ref={inputRef}
        label="Key Id"
        controlId="kid"
        value={kid}
        onChange={e => setKid(e.target.value)}
      />
      <TextInput
        label="Issuer"
        controlId="iss"
        value={issuer}
        onChange={e => setIssuer(e.target.value)}
      />
      <HttpAct
        name={stateType}
        params={params}
        Mutation={Mutation}
        onAction={transform}
        onSuccess={showJWT}
      />
      <Modal show={!!feedback} toggle={() => pushState(null, false)}>
        <Modal.Header>The Sign</Modal.Header>
        <Modal.Body>
          {typeof feedback == 'object' && (
            <>
              <img src={feedback.url} className={styles.qr} />
              <div className={classNames(
                styles.textBreak || styles['text-break'],
                styles.mb3 || styles['mb-3'],
              )}>{feedback.jwt}</div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

const Mutation = (props: Mutation<string, {[K in keyof SignRequest]: unknown}>) => (
  <form action={formData => props.mutate({
    format: formData.get('format'),
    payload: formData.get('payload'),
  })}>
    <YJPTextArea />
    <Button disabled={props.isPending}>
      {props.isPending ? 'processing' : 'Sign'}
    </Button>
  </form>
)

const canvas2blob = (canvas: HTMLCanvasElement) => (
  new Promise<Blob>(resolve => {
    canvas.toBlob(resolve as BlobCallback)
  })
)

const drawQR = (text: string) => (
  new Promise<HTMLCanvasElement>((resolve, reject) => {
    QRCode.toCanvas(text, { scale: 8 }, (error, canvas) => {
      if (error) {
        reject(error)
      } else {
        resolve(canvas)
      }
    })
  })
)

export default Signer
