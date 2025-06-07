import { type ReactElement } from 'react'
import Verifier from './components/Verifier'
import { MANAGEMENT_PORT, type MandatoryKey } from './contexts/app'
import KeyGen from './management/KeyGen'
import KeyList from './management/KeyList'
import Portable from './management/Portable'
import Signer from './management/Signer'

export type KeyState = keyof typeof sitemap

type Sitemap<K extends string> = Record<K, SitemapProps>

interface SitemapProps {
  name: string;
  element: ReactElement;
}

const defineSitemap = <K extends MandatoryKey | string>(sitemap: Sitemap<MandatoryKey | K>) => sitemap

const sitemap = defineSitemap({
  [MANAGEMENT_PORT]: {
    name: 'Port of Management',
    element: <Portable />,
  },
  mKeys: {
    name: 'Key List of Management',
    element: <KeyList />,
  },
  mNew: {
    name: 'KeyGen of Management',
    element: <KeyGen />,
  },
  mSign: {
    name: 'Signing of Management',
    element: <Signer />,
  },
  verify: {
    name: 'Signature Verifier',
    element: <Verifier />,
  },
})

export default sitemap