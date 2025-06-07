import { useEffect, useState } from 'react'
import YAML from 'yaml'
import ShowError from '../components/ShowError'
import { useComponents } from '../contexts/app'
import { useSectionName } from '../contexts/section'
import { useTransition } from '../contexts/transition'
import { type ListResult } from './helpers'

type STATE_TYPE = 'mKeys'

const keyList = ({ isLoading, data, error }: ListResult) => (data && (
  <>
    {isLoading && <div>u p d a t i n g . . .</div>}
    <pre>{YAML.stringify(data)}</pre>
  </>
)) || (error && (
  <ShowError error={error} />
))

const KeyList = () => {
  const { HttpGet } = useComponents()
  const stateType = useSectionName() as STATE_TYPE
  const listenFn = useTransition(stateType)
  const [refetchable, setRefetch] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    listenFn({
      onEnter() {
        setRefetch(true)
        setShow(true)
      },
      onExited() {
        setRefetch(false)
      }
    })
  }, [listenFn])

  return show && (
    <HttpGet
      name={stateType}
      refetchable={refetchable}
    >
      {keyList}
    </HttpGet>
  )
}

export default KeyList
