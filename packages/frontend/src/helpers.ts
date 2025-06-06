import { type KeyState } from '@a4smanjorg5/invoida-components/App'
import { createContext, useContext, useMemo } from 'react'

interface UseAppUrlHook {
  (name: KeyState, asText?: true): string;
  (name: KeyState, asText: false): URL;
}

const AppContext = createContext(0)

export const AppProvider = AppContext.Provider

export const useAppUrl = ((name: KeyState, asText: boolean = true) => {
  const portNumber = useContext(AppContext)
  const url = useMemo(() => {
    const originURL = 'http://localhost:' + portNumber
    let path: `/${string}` = '/'

    switch (name) {
      case 'mKeys':
      case 'mNew':
        path = '/certs'
        break
      case 'mSign':
        path = '/sign/'
        break
    }

    return new URL(path, originURL)
  }, [name, portNumber])

  return asText ? '' + url : url
}) as UseAppUrlHook
