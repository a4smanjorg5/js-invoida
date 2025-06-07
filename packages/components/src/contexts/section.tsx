import { type PropsWithChildren, createContext, useContext } from 'react'
import { type KeyState } from '../sitemap'

interface SectionContextValue {
  name?: KeyState;
}

const SectionContext = createContext<SectionContextValue>({})

export const SectionProvider = ({ children, ...rest }: PropsWithChildren<Required<SectionContextValue>>) => (
  <SectionContext.Provider value={rest}>
    {children}
  </SectionContext.Provider>
)

export const useSection = () => useContext(SectionContext) as Required<SectionContextValue>

export const useSectionName = () => useSection().name
