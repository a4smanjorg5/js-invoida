import { type ComponentType } from 'react'
import Accordion from '@genrwork/reactstrap/Accordion'
import ThemeProvider from '@genrwork/reactstrap/ThemeProvider'
import styles from '../../styles/main.module.scss'
import digsign from '../assets/digsign.svg'
import {
  type AppComponents,
  AppProvider,
  MANAGEMENT_PORT,
} from '../contexts/app'
import { HistoryProvider, useHistory } from '../contexts/history'
import { SectionProvider } from '../contexts/section'
import { TransitionProvider, useTransition } from '../contexts/transition'
import sitemap, { type KeyState } from '../sitemap'

interface Props extends Omit<AppComponents, 'Image'> {
  Favicon: ComponentType<{ [K in 'appName' | 'type' | 'href']: string }>;
  Image?: AppComponents['Image'];
  onPort?(portNumber: number): void;
}

const App = ({ portable }: { portable: boolean }) => {
  const [state, pushState] = useHistory()
  const events = useTransition()
  const handleSelect = (eventKey: KeyState) => {
    if (state?.name == eventKey) {
      history.back()
      pushState(null, false)
    } else {
      pushState({ name: eventKey }, false)
    }
  }

  return (
    <Accordion activeKey={state?.name} onSelect={handleSelect}>
      {(Object.keys(sitemap) as KeyState[]).filter(keyState =>
        keyState != MANAGEMENT_PORT || portable
      ).map(id =>
        <Accordion.Item key={id} {...events[id]} eventKey={id} >
          <Accordion.Header>{sitemap[id].name}</Accordion.Header>
          <Accordion.Body>
            <SectionProvider name={id}>
              {sitemap[id].element}
            </SectionProvider>
          </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
  )
}

const main = ({
  Favicon,
  Image = 'img',
  onPort,
  ...components
}: Props) => (
  <>
    <ThemeProvider aliases={styles}>
      <HistoryProvider>
        <AppProvider components={{ Image, ...components }} onPort={onPort}>
          <TransitionProvider>
            <App portable={typeof onPort == 'function'} />
          </TransitionProvider>
        </AppProvider>
      </HistoryProvider>
    </ThemeProvider>
    <Favicon appName={appName} {...favicon} />
  </>
)

export const appName = 'Invoida'

export const favicon = Object.freeze({
  // @ts-ignore
  href: (digsign.src || digsign) as string,
  type: 'image/svg+xml',
})

export { AppComponents, KeyState }

export default main
