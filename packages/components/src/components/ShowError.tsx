import { type UIEventHandler } from 'react'
import Alert from '@genrwork/reactstrap/Alert'
import Collapse from '@genrwork/reactstrap/Collapse'

const ShowError = ({ className, error, onClose, show = true }: {
  className?: string;
  error: Error | null,
  onClose?: UIEventHandler,
  show?: boolean;
}) => (
  <Collapse show={show}>
    <Alert className={className} onClose={onClose} variant="danger">
      <Alert.Heading>{error?.name}</Alert.Heading>
      <p>{error?.message}</p>
    </Alert>
  </Collapse>
)

export default ShowError
