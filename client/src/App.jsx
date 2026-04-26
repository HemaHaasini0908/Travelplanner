import { useState } from 'react'
import LandingPage from './components/LandingPage'
import PreferenceForm from './components/PreferenceForm'
import Results from './components/Results'

const globalStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --sand: #F5EDD6;
    --deep: #1A1208;
    --terra: #C4622D;
    --sage: #7A9E7E;
    --gold: #D4A847;
    --cream: #FBF6EC;
    --muted: #8B7355;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--deep);
    min-height: 100vh;
    overflow-x: hidden;
  }

  h1, h2, h3 { font-family: 'Playfair Display', serif; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--terra); border-radius: 3px; }
`

export default function App() {
  const [page, setPage] = useState('landing')
  const [tripData, setTripData] = useState(null)

  return (
    <>
      <style>{globalStyles}</style>
      {page === 'landing' && <LandingPage onStart={() => setPage('form')} />}
      {page === 'form' && (
        <PreferenceForm
          onResult={(data) => { setTripData(data); setPage('results'); }}
          onBack={() => setPage('landing')}
        />
      )}
      {page === 'results' && (
        <Results
          data={tripData}
          onReset={() => { setTripData(null); setPage('landing'); }}
        />
      )}
    </>
  )
}