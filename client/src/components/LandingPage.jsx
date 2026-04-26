export default function LandingPage({ onStart }) {
  const styles = {
    hero: {
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1A1208 0%, #2D1F0E 50%, #C4622D 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    },
    circle1: {
      position: 'absolute', width: '600px', height: '600px',
      borderRadius: '50%', border: '1px solid rgba(212,168,71,0.15)',
      top: '-150px', right: '-150px',
    },
    circle2: {
      position: 'absolute', width: '400px', height: '400px',
      borderRadius: '50%', border: '1px solid rgba(196,98,45,0.2)',
      bottom: '-100px', left: '-100px',
    },
    badge: {
      display: 'inline-block',
      background: 'rgba(212,168,71,0.15)',
      border: '1px solid rgba(212,168,71,0.4)',
      color: '#D4A847',
      padding: '6px 18px',
      borderRadius: '50px',
      fontSize: '0.75rem',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '2rem',
    },
    title: {
      fontSize: 'clamp(3rem, 8vw, 6rem)',
      color: '#F5EDD6',
      lineHeight: 1.05,
      marginBottom: '1.5rem',
      fontStyle: 'italic',
    },
    accent: { color: '#C4622D', fontStyle: 'normal' },
    subtitle: {
      color: 'rgba(245,237,214,0.6)',
      fontSize: '1.1rem',
      maxWidth: '480px',
      lineHeight: 1.7,
      marginBottom: '3rem',
      fontWeight: 300,
    },
    btn: {
      background: 'linear-gradient(135deg, #C4622D, #D4A847)',
      color: '#1A1208',
      border: 'none',
      padding: '18px 48px',
      borderRadius: '50px',
      fontSize: '1rem',
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 500,
      cursor: 'pointer',
      letterSpacing: '0.5px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    features: {
      display: 'flex',
      gap: '2rem',
      marginTop: '5rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    feat: {
      background: 'rgba(245,237,214,0.05)',
      border: '1px solid rgba(245,237,214,0.1)',
      borderRadius: '16px',
      padding: '1.5rem 2rem',
      textAlign: 'left',
      maxWidth: '220px',
    },
    featIcon: { fontSize: '2rem', marginBottom: '0.75rem' },
    featTitle: { color: '#F5EDD6', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' },
    featDesc: { color: 'rgba(245,237,214,0.5)', fontSize: '0.82rem', lineHeight: 1.6 },
  }

  return (
    <div style={styles.hero}>
      <div style={styles.circle1} />
      <div style={styles.circle2} />
      <div style={styles.badge}>✦ AI-Powered Travel</div>
      <h1 style={styles.title}>
        Your next adventure<br />
        <span style={styles.accent}>starts here.</span>
      </h1>
      <p style={styles.subtitle}>
        Tell us your vibe, budget, and days — we'll craft a full travel plan with destinations, day-by-day itinerary, and local food spots.
      </p>
      <button
        style={styles.btn}
        onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 8px 32px rgba(196,98,45,0.4)'; }}
        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}
        onClick={onStart}
      >
        Plan My Trip →
      </button>
      <div style={styles.features}>
        {[
          { icon: '🗺️', title: 'Smart Destinations', desc: 'AI picks the best spots for your exact vibe' },
          { icon: '📅', title: 'Day-by-Day Plan', desc: 'Morning to evening — every day mapped out' },
          { icon: '🍜', title: 'Local Food Picks', desc: 'Authentic spots recommended by AI' },
          { icon: '💾', title: 'Saved to Cloud', desc: 'Every trip saved to MongoDB, always accessible' },
        ].map(f => (
          <div key={f.title} style={styles.feat}>
            <div style={styles.featIcon}>{f.icon}</div>
            <div style={styles.featTitle}>{f.title}</div>
            <div style={styles.featDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}