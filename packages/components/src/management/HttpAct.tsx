import { useState } from 'react'
import ShowError from '../components/ShowError'
import { useComponents } from '../contexts/app'
import { type ActProps } from './helpers'

const HttpAct = (props: Omit<ActProps, 'onError'>) => {
  const { HttpAct } = useComponents()
  const [error, setError] = useState<Error | null>(null)
  const [showError, setShowError] = useState(false)

  const handleError = (err: Error) => {
    setError(err)
    setShowError(true)
  }

  return (
    <>
      <ShowError
        className="mb-3"
        onClose={() => setShowError(false)}
        show={showError}
        error={error}
      />
      <HttpAct
        {...props as ActProps}
        onAction={(data: never) => [
          typeof props.onAction == 'function' ? props.onAction(data) : data,
          setShowError(false),
        ][0]}
        onError={handleError}
      />
    </>
  )
}

export default HttpAct
