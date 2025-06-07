import { useRef, useEffect } from 'react'
import Button from '@genrwork/reactstrap/Button'
import Modal from '@genrwork/reactstrap/Modal'
import { type JWK } from 'jose'
import YAML from 'yaml'
import { TextInput } from '../components/Input'
import { useHistory } from '../contexts/history'
import { useSectionName } from '../contexts/section'
import { useTransition } from '../contexts/transition'
import { type Mutation } from '../helpers'
import HttpAct from './HttpAct'

type STATE_TYPE = 'mNew'

const KeyGen = () => {
  const stateType = useSectionName() as STATE_TYPE
  const [{ feedback }, pushState] = useHistory(stateType)

  const showData = (data: JWK) => {
    pushState({ feedback: data }, false)
  }

  return (
    <>
      <HttpAct
        name={stateType}
        Mutation={Mutation}
        onSuccess={showData}
      />
      <Modal show={!!feedback} toggle={() => pushState(null, false)}>
        <Modal.Header>New Public Key</Modal.Header>
        <Modal.Body>{feedback && (
          <pre>{YAML.stringify(feedback)}</pre>
        )}</Modal.Body>
      </Modal>
    </>
  )
}

const Mutation = (props: Mutation<JWK, string>) => {
  const stateType = useSectionName() as STATE_TYPE
  const listenFn = useTransition(stateType)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listenFn({
      onEntering: () => {
        inputRef.current?.focus()
      }
    })
  }, [listenFn])

  return (
    <form action={formData => props.mutate(formData.get('kid') as string)}>
      <TextInput ref={inputRef} label="Key Id" name="kid" />
      <Button disabled={props.isPending}>
        {props.isPending ? 'processing' : 'Add key'}
      </Button>
    </form>
  )
}

export default KeyGen
