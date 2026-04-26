import { useState } from 'react'
import axios from 'axios'

const VIBES = [
  { id: 'adventure', label: '🏔️ Adventure', desc: 'Hiking, thrills, outdoors' },
  { id: 'cultural', label: '🏛️ Cultural', desc: 'History, art, heritage' },
  { id: 'relaxation', label: '🏖️ Relaxation', desc: 'Beach, spa, chill' },
  { id: 'romantic', label: '💑 Romantic', desc: 'Couples, scenic, cozy' },
  { id: 'foodie', label: '🍽️ Foodie', desc: 'Cuisine, markets, tastings' },
  { id: 'party', label: '🎉 Nightlife', desc: 'Clubs, bars, festivals' },
]

function formatBudget(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
  return `₹${value}`
}

export default function PreferenceForm({ onResult, onBack }) {
  const [vibe, setVibe] = useState('')
  const [budget, setBudget] = useState(50000)
  const [duration, setDuration] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const s = {
    page: { minHeight: '100vh', background: 'var(--cream)', padding: '2rem' },
    nav: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' },
    back: {
      background: 'none', border: '1px solid var(--muted)',
      color: 'var(--muted)', padding: '8px 20px', borderRadius: '50px',
      cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem'
    },
    logo: { fontFamily: 'Playfair Display', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--terra)' },
    container: { maxWidth: '720px', margin: '0 auto' },
    heading: { fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--deep)' },
    sub: { color: 'var(--muted)', marginBottom: '3rem', fontSize: '1rem' },
    section: { marginBottom: '2.5rem' },
    label: { fontFamily: 'Playfair Display', fontSize: '1.2rem', marginBottom: '1rem', display: 'block', color: 'var(--deep)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
    card: (selected) => ({
      border: `2px solid ${selected ? 'var(--terra)' : '#E8DCC8'}`,
      background: selected ? 'rgba(196,98,45,0.08)' : 'white',
      borderRadius: '16px', padding: '1.25rem',
      cursor: 'pointer', transition: 'all 0.2s',
    }),
    cardLabel: (selected) => ({ fontWeight: 500, color: selected ? 'var(--terra)' : 'var(--deep)', marginBottom: '4px' }),
    cardDesc: { fontSize: '0.8rem', color: 'var(--muted)' },
    sliderWrap: { marginTop: '1rem' },
    slider: { width: '100%', accentColor: 'var(--terra)', cursor: 'pointer', height: '6px' },
    displayRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' },
    bigNum: { fontFamily: 'Playfair Display', fontSize: '2rem', color: 'var(--terra)' },
    rangeLab: { color: 'var(--muted)', fontSize: '0.9rem' },

    // Budget input style
    budgetBox: {
      display: 'flex', alignItems: 'center', gap: '1rem',
      background: 'white', border: '2px solid #E8DCC8',
      borderRadius: '16px', padding: '1rem 1.5rem',
      marginBottom: '1rem', transition: 'border-color 0.2s',
    },
    rupee: { fontFamily: 'Playfair Display', fontSize: '1.8rem', color: 'var(--terra)' },
    budgetInput: {
      border: 'none', outline: 'none', fontSize: '1.8rem',
      fontFamily: 'Playfair Display', color: 'var(--deep)',
      width: '100%', background: 'transparent',
    },
    budgetFormatted: {
      color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem',
      fontStyle: 'italic',
    },
    budgetSliderRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' },
    quickBtn: (active) => ({
      padding: '6px 16px', borderRadius: '50px', fontSize: '0.8rem',
      border: `1px solid ${active ? 'var(--terra)' : '#E8DCC8'}`,
      background: active ? 'rgba(196,98,45,0.1)' : 'white',
      color: active ? 'var(--terra)' : 'var(--muted)',
      cursor: 'pointer', fontFamily: 'DM Sans',
    }),

    btn: {
      width: '100%', padding: '18px',
      background: 'linear-gradient(135deg, var(--terra), var(--gold))',
      color: 'var(--deep)', border: 'none', borderRadius: '16px',
      fontSize: '1.1rem', fontWeight: 600, fontFamily: 'DM Sans',
      cursor: 'pointer', marginTop: '1rem',
      opacity: (!vibe || !budget || loading) ? 0.5 : 1,
    },
    error: { color: 'red', marginTop: '1rem', textAlign: 'center' },
    loader: { textAlign: 'center', padding: '2rem', color: 'var(--muted)' },
  }

  const quickAmounts = [
    { label: '₹10K', value: 10000 },
    { label: '₹25K', value: 25000 },
    { label: '₹50K', value: 50000 },
    { label: '₹1L', value: 100000 },
    { label: '₹2L', value: 200000 },
    { label: '₹5L', value: 500000 },
  ]

  const handleBudgetInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setBudget(raw === '' ? '' : Number(raw))
  }

  const handleGenerate = async () => {
    if (!vibe || !budget) return
    setLoading(true)
    setError('')
    try {
      const budgetLabel = `₹${Number(budget).toLocaleString('en-IN')}`
      const { data } = await axios.post('/api/trips/generate', {
        vibe,
        budget: budgetLabel,
        duration
      })
      onResult(data)
    } catch {
      setError('Something went wrong. Please check your API keys and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <button style={s.back} onClick={onBack}>← Back</button>
        <span style={s.logo}>Wandr</span>
      </nav>

      <div style={s.container}>
        <h2 style={s.heading}>Plan Your Trip</h2>
        <p style={s.sub}>Answer 3 quick questions — we'll handle the rest.</p>

        {/* VIBE */}
        <div style={s.section}>
          <label style={s.label}>1. What's your travel vibe?</label>
          <div style={s.grid}>
            {VIBES.map(v => (
              <div key={v.id} style={s.card(vibe === v.id)} onClick={() => setVibe(v.id)}>
                <div style={s.cardLabel(vibe === v.id)}>{v.label}</div>
                <div style={s.cardDesc}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BUDGET */}
        <div style={s.section}>
          <label style={s.label}>2. What's your budget?</label>

          <div style={s.budgetBox}>
            <span style={s.rupee}>₹</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter amount"
              value={budget === '' ? '' : budget}
              onChange={handleBudgetInput}
              style={s.budgetInput}
            />
          </div>

          {budget !== '' && budget > 0 && (
            <div style={s.budgetFormatted}>
              = {formatBudget(Number(budget))} per person (approx)
            </div>
          )}

          <div style={s.budgetSliderRow}>
            {quickAmounts.map(q => (
              <button
                key={q.value}
                style={s.quickBtn(Number(budget) === q.value)}
                onClick={() => setBudget(q.value)}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* DURATION */}
        <div style={s.section}>
          <label style={s.label}>3. How many days?</label>
          <div style={s.sliderWrap}>
            <input
              type="range" min="2" max="30"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              style={s.slider}
            />
            <div style={s.displayRow}>
              <span style={s.rangeLab}>2 days</span>
              <span style={s.bigNum}>{duration} days</span>
              <span style={s.rangeLab}>30 days</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={s.loader}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✈️</div>
            <p>AI is crafting your perfect itinerary...</p>
          </div>
        ) : (
          <button style={s.btn} onClick={handleGenerate} disabled={!vibe || !budget}>
            Generate My Travel Plan ✨
          </button>
        )}
        {error && <p style={s.error}>{error}</p>}
      </div>
    </div>
  )
}