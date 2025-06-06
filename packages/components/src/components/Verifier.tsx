import {
  type ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Button from '@genrwork/reactstrap/Button'
import Modal from '@genrwork/reactstrap/Modal'
import { type IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'
import classNames from 'classnames'
import { type JWTVerifyResult, jwtVerify, createRemoteJWKSet } from 'jose'
import YAML from 'yaml'
import styles from '../../styles/main.module.scss'
import { useComponents } from '../contexts/app'
import { useSectionName } from '../contexts/section'
import { useHistory } from '../contexts/history'
import { useTransition } from '../contexts/transition'
import type { ResultProps, Mutation } from '../helpers'
import { TextInput } from './Input'
import ShowError from './ShowError'
import 'core-js/stable/url/can-parse'

type STATE_TYPE = 'verify'

export interface VerifierState {
  feedback: Partial<VerificationFeedback>;
}

interface VerificationFeedback {
  verified: JWTVerifyResult;
  jwt: string;
}

export interface VerifyProps extends ResultProps<VerificationFeedback> {
  name: STATE_TYPE;
  VerifyAct: ComponentType<Mutation<VerificationFeedback, string>>;
  certsURL: string;
  onAction?: VoidFunction;
  onVerify(jwt: string, certsURL: URL): Promise<VerificationFeedback>;
}

const Verifier = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const stateType = useSectionName() as STATE_TYPE
  const listenFn = useTransition(stateType)
  const [{ feedback }, pushState] = useHistory(stateType)
  const { Verifier, onPort } = useComponents()
  const [url, setUrl] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    listenFn({
      onEntering: () => {
        inputRef.current?.focus()
      }
    })
  }, [listenFn])

  useEffect(() => {
    if (feedback) {
      setShowError(false)
    }
  }, [feedback])

  const handleError = (err: Error) => {
    if (feedback) {
      pushState(null, false)
    }
    setError(err)
    setShowError(true)
  }

  const handleVerify: VerifyProps['onVerify'] = useCallback(async (jwt, url) => {
    const { payload, ...rest } = await jwtVerify(jwt, createRemoteJWKSet(url))

    return {
      jwt,
      verified: { ...rest, payload },
    }
  }, [url])

  const canScan = useMemo(() => (
    typeof onPort != 'function' || URL.canParse(url)
  ), [onPort, url])

  return (
    <>
      {typeof onPort == 'function' && (
        <TextInput
          ref={inputRef}
          label="Url of JWK set"
          controlId="jwkUrl"
          onChange={ev => setUrl(ev.target.value)}
          value={url}
        />
      )}
      <ShowError
        className="mb-3"
        onClose={() => setShowError(false)}
        show={showError}
        error={error}
      />
      <Button
        disabled={!canScan}
        onClick={() => pushState({ feedback: {} }, false)}
      >
        Start Scan
      </Button>
      {typeof onPort == 'function' && (
        <>
          <div className={styles.mb3 || styles['mb-3']} />
          <Verifier
            name="verify"
            certsURL={url}
            onAction={() => setShowError(false)}
            onError={handleError}
            onSuccess={result => pushState({ feedback: result }, false)}
            onVerify={handleVerify}
            VerifyAct={VerifyToken}
          />
        </>
      )}
      <Modal show={!!feedback} toggle={() => pushState(null, false)}>
        <Modal.Header>{feedback && !feedback.verified ? 'Scan JWT' : 'The Signature is Valid'}</Modal.Header>
        <Modal.Body>{feedback?.verified ? (
          <>
            <div className={classNames(styles.mb3 || styles['mb-3'], styles.textBreak || styles['text-break'])}>
              The signature is {feedback.jwt}
            </div>
            <div>Valid with the <u>details</u> below</div>
            <pre>{YAML.stringify(feedback.verified.payload)}</pre>
          </>
        ) : feedback && (
          <Verifier
            name="verify"
            certsURL={url}
            onError={handleError}
            onSuccess={result => pushState({ feedback: result }, true)}
            onVerify={handleVerify}
            VerifyAct={VerifyScanner}
          />
        )}</Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  )
}

const VerifyScanner = (props: Mutation<VerificationFeedback, string>) => {
  const [paused, setPause] = useState(false)
  const startVerify = useCallback((detected: IDetectedBarcode[]) => {
    setPause(true)
    props.mutate(detected[0].rawValue)
  }, [])

  return (
    <Scanner
      onScan={startVerify}
      paused={paused}
    />
  )
}

const VerifyToken = (props: Mutation<VerificationFeedback, string>) => (
  <form action={formData => props.mutate(formData.get('jwt') as string)}>
    <TextInput
      label="JWToken"
      name="jwt"
    />
    <Button>Verify</Button>
  </form>
)

export default Verifier
