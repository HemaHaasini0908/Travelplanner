import { useState } from 'react'
import axios from 'axios'

export default function Results({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('destinations')
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedDest, setSelectedDest] = useState(0)
  const [itinerary, setItinerary] = useState(data.itinerary || {})
  const [foodSpots, setFoodSpots] = useState(data.foodSpots || [])
  const [loadingDest, setLoadingDest] = useState(false)

  if (!data) return null
  const { destinations = [] } = data

  const handleDestClick = async (dest, index) => {
    if (index === selectedDest) return
    setSelectedDest(index)
    setLoadingDest(true)
    setActiveTab('destinations')
    try {
      const { data: res } = await axios.post('/api/trips/destination', {
        destination: dest.name,
        vibe: data.vibe || 'adventure',
        budget: data.budget || '50000',
        duration: data.duration || 5
      })
      setItinerary(res.itinerary)
      setFoodSpots(res.foodSpots)
      setSelectedDay(0)
    } catch {
      console.error('Failed to load destination plan')
    } finally {
      setLoadingDest(false)
    }
  }

  const s = {
    page: { minHeight: '100vh', background: 'var(--cream)' },
    header: {
      background: 'linear-gradient(135deg, var(--deep) 0%, #2D1F0E 100%)',
      padding: '2rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    logo: { fontFamily: 'Playfair Display', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--sand)' },
    resetBtn: {
      background: 'rgba(245,237,214,0.1)', border: '1px solid rgba(245,237,214,0.3)',
      color: 'var(--sand)', padding: '10px 24px', borderRadius: '50px',
      cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem',
    },
    hero: {
      background: 'linear-gradient(160deg, var(--deep) 0%, #3D2510 100%)',
      padding: '3rem 2rem', textAlign: 'center',
    },
    heroTitle: { fontFamily: 'Playfair Display', fontSize: '2.5rem', color: 'var(--sand)', fontStyle: 'italic', marginBottom: '0.5rem' },
    heroSub: { color: 'rgba(245,237,214,0.6)', fontSize: '1rem' },
    tabs: {
      display: 'flex', background: 'white',
      borderBottom: '1px solid #E8DCC8',
      padding: '0 2rem',
      position: 'sticky', top: 0, zIndex: 10,
    },
    tab: (active) => ({
      padding: '1rem 1.5rem',
      border: 'none', background: 'none',
      borderBottom: active ? '3px solid var(--terra)' : '3px solid transparent',
      color: active ? 'var(--terra)' : 'var(--muted)',
      cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.95rem',
      fontWeight: active ? 600 : 400, transition: 'all 0.2s',
    }),
    content: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
    sectionTitle: { fontFamily: 'Playfair Display', fontSize: '1.8rem', color: 'var(--deep)', marginBottom: '0.5rem' },
    sectionSub: { color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.95rem' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
    destCard: (selected) => ({
      background: 'white', borderRadius: '20px',
      overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      border: `2px solid ${selected ? 'var(--terra)' : '#F0E8D8'}`,
      cursor: 'pointer', transition: 'all 0.2s',
      transform: selected ? 'scale(1.02)' : 'scale(1)',
    }),
    destTop: (selected) => ({
      background: selected
        ? 'linear-gradient(135deg, var(--terra), var(--gold))'
        : 'linear-gradient(135deg, #8B7355, #A0856B)',
      padding: '2rem', position: 'relative',
    }),
    destNum: { position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.2)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600 },
    destName: { color: 'white', fontFamily: 'Playfair Display', fontSize: '1.4rem' },
    destHighlight: { color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: '0.25rem' },
    destBody: { padding: '1.25rem' },
    destDesc: { color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 },
    selectedBadge: {
      display: 'inline-block', background: 'var(--terra)', color: 'white',
      fontSize: '0.75rem', padding: '3px 10px', borderRadius: '50px',
      marginTop: '0.5rem', fontWeight: 500,
    },
    loadingOverlay: {
      textAlign: 'center', padding: '3rem', color: 'var(--muted)',
    },
    dayNav: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' },
    dayBtn: (active) => ({
      padding: '8px 20px', borderRadius: '50px',
      border: `2px solid ${active ? 'var(--terra)' : '#E8DCC8'}`,
      background: active ? 'var(--terra)' : 'white',
      color: active ? 'white' : 'var(--muted)',
      cursor: 'pointer', fontFamily: 'DM Sans', fontSize: '0.9rem',
      fontWeight: active ? 600 : 400,
    }),
    dayCard: {
      background: 'white', borderRadius: '20px',
      padding: '2rem', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    },
    dayTheme: { fontFamily: 'Playfair Display', fontSize: '1.5rem', color: 'var(--terra)', marginBottom: '1.5rem' },
    timeSlot: { display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start' },
    timeBadge: { background: 'var(--deep)', color: 'var(--sand)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap', marginTop: '3px' },
    slotText: { color: 'var(--deep)', lineHeight: 1.7, fontSize: '0.95rem' },
    foodGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' },
    foodCard: {
      background: 'white', borderRadius: '16px', padding: '1.5rem',
      border: '1px solid #F0E8D8', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    foodIcon: { fontSize: '2rem', marginBottom: '0.75rem' },
    foodName: { fontWeight: 600, color: 'var(--deep)', marginBottom: '0.25rem' },
    foodType: { fontSize: '0.78rem', color: 'var(--terra)', fontWeight: 500, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
    foodDesc: { fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 },
  }

  const foodIcons = ['🍜', '🍛', '🥘', '🍣', '🥗', '🍲', '🥙', '🍱']
  const days = itinerary?.days || []

  return (
    <div style={s.page}>
      <div style={s.header}>
        <span style={s.logo}>Wandr</span>
        <button style={s.resetBtn} onClick={onReset}>← New Trip</button>
      </div>

      <div style={s.hero}>
        <div style={s.heroTitle}>Your Trip is Ready! 🎉</div>
        <div style={s.heroSub}>
          {itinerary?.destination} · {data.duration} days · Saved to cloud
        </div>
      </div>

      <div style={s.tabs}>
        {[
          { id: 'destinations', label: '🗺️ Destinations' },
          { id: 'itinerary', label: '📅 Itinerary' },
          { id: 'food', label: '🍽️ Food Spots' },
        ].map(t => (
          <button key={t.id} style={s.tab(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {activeTab === 'destinations' && (
          <>
            <h2 style={s.sectionTitle}>Recommended Destinations</h2>
            <p style={s.sectionSub}>Click a destination to load its itinerary and food spots.</p>
            {loadingDest ? (
              <div style={s.loadingOverlay}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✈️</div>
                <p>Loading plan for {destinations[selectedDest]?.name}...</p>
              </div>
            ) : (
              <div style={s.grid3}>
                {destinations.map((d, i) => (
                  <div key={i} style={s.destCard(selectedDest === i)} onClick={() => handleDestClick(d, i)}>
                    <div style={s.destTop(selectedDest === i)}>
                      <div style={s.destNum}>#{i + 1}</div>
                      <div style={s.destName}>{d.name}</div>
                      <div style={s.destHighlight}>✨ {d.highlight}</div>
                    </div>
                    <div style={s.destBody}>
                      <p style={s.destDesc}>{d.description}</p>
                      {selectedDest === i && <span style={s.selectedBadge}>✓ Selected</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'itinerary' && (
          <>
            <h2 style={s.sectionTitle}>{itinerary?.destination}</h2>
            <p style={s.sectionSub}>Your day-by-day travel plan.</p>
            <div style={s.dayNav}>
              {days.map((d, i) => (
                <button key={i} style={s.dayBtn(selectedDay === i)} onClick={() => setSelectedDay(i)}>
                  Day {d.day}
                </button>
              ))}
            </div>
            {days[selectedDay] && (
              <div style={s.dayCard}>
                <div style={s.dayTheme}>{days[selectedDay].theme}</div>
                <div style={s.timeSlot}>
                  <div style={s.timeBadge}>Morning</div>
                  <p style={s.slotText}>{days[selectedDay].morning}</p>
                </div>
                <div style={s.timeSlot}>
                  <div style={s.timeBadge}>Afternoon</div>
                  <p style={s.slotText}>{days[selectedDay].afternoon}</p>
                </div>
                <div style={s.timeSlot}>
                  <div style={s.timeBadge}>Evening</div>
                  <p style={s.slotText}>{days[selectedDay].evening}</p>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'food' && (
          <>
            <h2 style={s.sectionTitle}>Local Food Spots</h2>
            <p style={s.sectionSub}>Authentic flavors in {itinerary?.destination}.</p>
            <div style={s.foodGrid}>
              {foodSpots.map((f, i) => (
                <div key={i} style={s.foodCard}>
                  <div style={s.foodIcon}>{foodIcons[i % foodIcons.length]}</div>
                  <div style={s.foodName}>{f.name}</div>
                  <div style={s.foodType}>{f.type}</div>
                  <div style={s.foodDesc}>{f.description}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}