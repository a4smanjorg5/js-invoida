import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { VerifierState } from '../components/Verifier'
import type { MgmtStateMap } from '../management/helpers'
import { type KeyState } from '../sitemap'

interface Dispatch<A> {
  (value: A, replace: boolean): void
}

type HistoryContextValue = [ObjectState, Dispatch<ObjectState>]

type ObjectState = {
  [K in KeyState]: ObjectStateProps<K>;
}[KeyState] | null

type ObjectStateProps<K extends KeyState> = StateMap[K] extends never
? { name: K }
: StateMap[K] & { name: K }

interface SectionMap {
  'verify': Partial<VerifierState>;
}

type StateMap = Record<Exclude<KeyState, keyof MgmtStateMap | keyof SectionMap>, never>
  & MgmtStateMap
  & SectionMap

interface UseHistoryHook {
  <K extends KeyState>(stateType: K): [
    Partial<ObjectStateProps<K>>,
    Dispatch<StateMap[K] | null>,
  ];
  (): HistoryContextValue;
}

const HistoryContext = createContext<HistoryContextValue>([null, () => {}])

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [objState, setState] = useState<ObjectState>(null)

  const handleState = ({ state }: PopStateEvent) => {
    setState(state)
  }

  const setHistoryState: Dispatch<ObjectState> = useCallback((state, replace) => {
    history[replace ? 'replaceState' : 'pushState'](state, '')
    setState(state)
  }, [])

  useEffect(() => {
    window.addEventListener('popstate', handleState)

    return () => window.removeEventListener('popstate', handleState)
  }, [])

  return (
    <HistoryContext.Provider value={[objState, setHistoryState]}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = (<K extends KeyState>(stateType?: K) => {
  const [objState, setState] = useContext(HistoryContext)
  const setStateFn = useMemo(() => (
    stateType ? (state: StateMap[K], replace: boolean) => setState({
      ...state,
      name: stateType,
    } as ObjectState, replace) : setState
  ), [stateType, setState])

  const computedState = useMemo(() => (
    {...(stateType && objState?.name !== stateType ? null : objState)}
  ), [stateType, objState])

  return [computedState, setStateFn]
}) as UseHistoryHook
