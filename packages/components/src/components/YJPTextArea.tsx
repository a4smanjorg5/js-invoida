import { type ChangeEventHandler, useRef, useState } from 'react'
import Form from '@genrwork/reactstrap/Form'
import YAML from 'yaml'
import styles from '../../styles/main.module.scss'

const YJPTextArea = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [format, setFormat] = useState<'yaml' | 'json' | 'plain'>('yaml')
  const [text, setText] = useState('')

  const handleChange: ChangeEventHandler<HTMLInputElement> = ev => {
    const newFormat = ev.target.value as typeof format
    setFormat(newFormat)
    inputRef.current!.focus()
    if (text) {
      let payload: unknown
      try {
        switch (format) {
          case 'yaml':
            payload = YAML.parse(text)
            break;
          case 'json':
            payload = JSON.parse(text)
            break;
          default:
            payload = text
            break;
        }
      } catch (error) {
        payload = text
      }
      switch (newFormat) {
        case 'yaml':
          setText(YAML.stringify(payload))
          break;
        case 'json':
          setText(JSON.stringify(payload, null, 4))
          break;
        default:
          setText(typeof payload == 'string' ? payload : text)
          break;
      }
    }
  }

  return (
    <div className={styles.mb3 || styles['mb-3']}>
      <div>
        <Form.Check
          inline
          type="radio"
          controlId="yaml"
          name="format"
          label="YAML"
          value="yaml"
          onChange={handleChange}
          checked={format == 'yaml'}
        />
        <Form.Check
          inline
          type="radio"
          controlId="json"
          name="format"
          label="JSON"
          value="json"
          onChange={handleChange}
          checked={format == 'json'}
        />
        <Form.Check
          inline
          type="radio"
          controlId="plain"
          name="format"
          label="Plain Text"
          value="plain"
          onChange={handleChange}
          checked={format == 'plain'}
        />
      </div>
      <Form.Control
        as="textarea"
        name="payload"
        ref={inputRef}
        onChange={ev => setText(ev.target.value)}
        rows={5}
        value={text}
      />
    </div>
  )
}

export default YJPTextArea
