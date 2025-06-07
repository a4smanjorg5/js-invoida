import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type KeyState } from '../sitemap'

type TransitionContextValue = [
  {
    [K in KeyState]?: TransitionHandlers;
  },
  (keyState: KeyState, handlers: TransitionHandlers) => void
]

type TransitionHandlers = {
  [K in
    | 'onEnter'
    | 'onEntering'
    | 'onEntered'
    | 'onExit'
    | 'onExiting'
    | 'onExited'
  ]?: VoidFunction;
}

interface UseTransitionHook {
  (keyState: KeyState): ((handlers: TransitionHandlers) => void);
  (): TransitionContextValue[0];
}

const TransitionContext = createContext<TransitionContextValue>([{}, () => {}])

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const [events, listen] = useState<TransitionContextValue[0]>({})

  const listenFn = useMemo((): TransitionContextValue[1] => (
    (keyState, handlers) => listen(prevState => (
      prevState[keyState] === handlers
      ? prevState
      : { ...prevState, [keyState]: handlers }
    ))
  ), [])

  return (
    <TransitionContext.Provider value={[events, listenFn]}>
      {children}
    </TransitionContext.Provider>
  )
}

export const useTransition = ((keyState?: KeyState) => {
  const [events, listen] = useContext(TransitionContext)

  const listenFn = useMemo(() => (
    keyState && (
      (handlers: TransitionHandlers) => listen(keyState, handlers)
    )
  ), [keyState, listen])

  return listenFn || events
}) as UseTransitionHook
