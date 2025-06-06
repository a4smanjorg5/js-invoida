import {
  type ComponentType,
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from 'react'
import type { ActProps, ListProps } from '../management/helpers'
import type { VerifyProps } from '../components/Verifier'

export interface AppComponents {
  HttpGet: ComponentType<ListProps>;
  HttpAct: ComponentType<ActProps>;
  Image: ComponentType<ImageProps> | 'img';
  Verifier: ComponentType<VerifyProps>;
}

export interface AppContextValue {
  components?: AppComponents;
  onPort?(portNumber: number): void;
  self?: AppVariables;
}

interface AppVariables {
  signImg?: string;
}

type ImageProps = { [K in 'alt' | 'className' | 'src']: string }

export type MandatoryKey = typeof MANAGEMENT_PORT

const AppContext = createContext<AppContextValue>({})

export const AppProvider = ({
  children,
  components,
  onPort,
}: PropsWithChildren<AppContextValue>) => {
  const appRef = useRef<AppVariables>({})
  const ctx = useMemo(() => (
    { components, onPort, self: appRef.current }
  ), [components, onPort])

  return (
    <AppContext.Provider value={ctx}>
      {children}
    </AppContext.Provider>
  )
}

export const MANAGEMENT_PORT = 'mPort'

export const useAppVariables = () => useContext(AppContext).self!

export const useComponents = () => {
  const { components, onPort } = useContext(AppContext)
  const result = useMemo(() => (
    { ...components!, onPort }
  ), [components, onPort])

  return result
}
