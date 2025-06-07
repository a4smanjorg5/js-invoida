import { type ChangeEvent, useEffect, useRef } from 'react'
import { NumberInput } from '../components/Input'
import { useComponents } from '../contexts/app'
import { useSectionName } from '../contexts/section'
import { useTransition } from '../contexts/transition'

const Portable = () => {
  const { onPort } = useComponents()
  const inputRef = useRef<HTMLInputElement>(null)
  const stateType = useSectionName()
  const listenFn = useTransition(stateType)

  useEffect(() => {
    listenFn({
      onEntering: () => {
        inputRef.current?.focus()
      }
    })
  }, [listenFn])

  const portChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    onPort!(+ev.target.value)
  }

  return (
    <NumberInput
      ref={inputRef}
      label="Url port"
      controlId="port"
      max={65535}
      min={1}
      onChange={portChanged}
    />
  )
}

export default Portable
