import { useState } from 'react'
import MyComponent from '@a4smanjorg5/invoida-components/App'
import Favicon from './components/Favicon'
import HttpAct from './components/HttpAct'
import HttpGet from './components/HttpGet'
import Verifier from './components/Verifier'
import { AppProvider } from './helpers'

function App() {
  const [portNumber, setPortNumber] = useState(0)

  return (
    <AppProvider value={portNumber}>
      <MyComponent
        Favicon={Favicon}
        HttpGet={HttpGet}
        HttpAct={HttpAct}
        Verifier={Verifier}
        onPort={setPortNumber}
      />
    </AppProvider>
  )
}

export default App
