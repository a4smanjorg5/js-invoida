import { type ReactNode } from 'react'
import ReactDOM from 'react-dom'

const Head = (props: { children: ReactNode }) => ReactDOM.createPortal(
  <>{props.children}</>,
  document.head,
)

export default Head
