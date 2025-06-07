import { type InputHTMLAttributes, forwardRef } from 'react'
import Form from '@genrwork/reactstrap/Form'
import styles from '../../styles/main.module.scss'

type Props = NumberInputProps | TextInputProps
type InputProps = Props & Required<Pick<Props, 'type'>>

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

type IdentiProps =
  | { controlId?: string; name: string }
  | { controlId: string; name?: string }

export interface NumberInputProps extends BaseInputProps {
  type?: 'number';
  defaultValue?: number;
  max?: number;
  min?: number;
}

export interface TextInputProps extends BaseInputProps {
  type?: 'text' | 'password';
  defaultValue?: string;
}

const ReactInput = forwardRef<HTMLInputElement, IdentiProps & InputProps>(({
  controlId,
  label,
  ...props
}, ref) => (
  <Form.Group className={styles.mb3 || styles['mb-3']} controlId={(controlId || props.name)!}>
    <Form.Label>{label || props.name || controlId}</Form.Label>
    <Form.Control
      ref={ref}
      {...props}
    />
  </Form.Group>
))

export const NumberInput = forwardRef<HTMLInputElement, IdentiProps & NumberInputProps>((props, ref) => (
  <ReactInput ref={ref} {...props} type="number" />
))

export const TextInput = forwardRef<HTMLInputElement, IdentiProps & TextInputProps>((props, ref) => (
  <ReactInput ref={ref} {...props} type="text" />
))

export default ReactInput
