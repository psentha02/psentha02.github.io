// Variation A — "Constellation"
// Dark navy with warm cream accent, serif display, card grid + chatbot at bottom.
// A polished, original take on the reference: pendant orb in corner, animated star field,
// subtle glow on cards, and the chatbot uses a "command bar" treatment.

const VarA = ({ data, tweaks }) => {
  const { messages, sending, send } = window.usePravGPT();
  const [input, setInput] = React.useState('');
  const [page, _setPage] = React.useState(() => {
    const h = (typeof window !== 'undefined' && window.location.hash || '').replace('#/', '').replace('#', '');
    return ['about','work','projects','contact'].includes(h) ? h : 'home';
  });
  const setPage = React.useCallback((p) => {
    _setPage(p);
    try {
      const hash = p === 'home' ? '' : `#/${p}`;
      window.history.pushState({ page: p }, '', window.location.pathname + window.location.search + hash);
    } catch (e) {}
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, []);
  React.useEffect(() => {
    const onPop = () => {
      const h = (window.location.hash || '').replace('#/', '').replace('#', '');
      _setPage(['about','work','projects','contact'].includes(h) ? h : 'home');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const [theme, setTheme] = React.useState('dark');
  const scrollRef = React.useRef(null);
  const detailScrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    if (detailScrollRef.current) detailScrollRef.current.scrollTop = 0;
  }, [page]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    send(input);
    setInput('');
  };

  const palettes = {
    dark: {
      warm: { bg: '#0e0d0c', surface: '#1a1816', border: '#2a2622', accent: '#f4d8a8', muted: '#8a8278', fg: '#f6f3ee', soft: '#e8e4dd', softer: '#d4cfc6' },
      cool: { bg: '#0a0d12', surface: '#141821', border: '#202635', accent: '#a8c8f4', muted: '#7a8398', fg: '#f6f3ee', soft: '#e0e6f0', softer: '#c8d0e0' },
      plum: { bg: '#10090f', surface: '#1d1320', border: '#2c1f30', accent: '#e8b8d8', muted: '#8a7a85', fg: '#f6f3ee', soft: '#e8d8e0', softer: '#d4c0cc' },
    },
    light: {
      warm: { bg: '#f5efe4', surface: '#fffaf0', border: '#e0d6c4', accent: '#b8843a', muted: '#7a6e5a', fg: '#1a1612', soft: '#2a2418', softer: '#3a3328' },
      cool: { bg: '#eef1f6', surface: '#fbfcff', border: '#d6dde8', accent: '#3a6cb8', muted: '#5a6878', fg: '#0f1420', soft: '#1f2530', softer: '#2f3540' },
      plum: { bg: '#f4eef2', surface: '#fff8fc', border: '#e4d6dc', accent: '#a83a7a', muted: '#7a5a6e', fg: '#1c1118', soft: '#2c1f28', softer: '#3c2f38' },
    },
  };
  const palette = { ...palettes[theme][tweaks.palette || 'warm'], theme };

  const fonts = {
    classic: { display: '"Playfair Display", Georgia, serif', body: 'Inter, system-ui, sans-serif' },
    modern: { display: '"Fraunces", Georgia, serif', body: '"DM Sans", system-ui, sans-serif' },
    techy: { display: '"Newsreader", Georgia, serif', body: '"JetBrains Mono", monospace' },
  }[tweaks.fonts || 'classic'];

  const showStars = tweaks.bg !== 'none' && tweaks.bg !== 'grid' && tweaks.bg !== 'noise';
  const showGrid = tweaks.bg === 'grid';
  const showNoise = tweaks.bg === 'noise';

  const cardStyleBase = {
    glass: { background: `${palette.surface}aa`, backdropFilter: 'blur(12px)', border: `1px solid ${palette.border}` },
    flat: { background: palette.surface, border: 'none' },
    bordered: { background: palette.surface, border: `1px solid ${palette.border}` },
  }[tweaks.cardStyle || 'bordered'];

  const density = tweaks.density === 'tight' ? 0.8 : tweaks.density === 'loose' ? 1.25 : 1;

  return (
    <div data-screen-label="Variation A — Constellation" style={{
      width: '100%', minHeight: '100vh', background: palette.bg, color: palette.fg,
      fontFamily: fonts.body, position: 'relative', overflow: 'hidden',
      paddingBottom: tweaks.chatPos === 'top' ? 40 : 200,
      paddingTop: tweaks.chatPos === 'top' ? 280 : 80,
      transition: 'background-color 600ms ease, color 600ms ease',
    }}>
      {/* Background */}
      {showStars && <StarField accent={palette.accent} />}
      {showGrid && <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${palette.border} 1px, transparent 1px), linear-gradient(90deg, ${palette.border} 1px, transparent 1px)`,
        backgroundSize: '48px 48px', opacity: 0.4, pointerEvents: 'none',
      }} />}
      {showNoise && <div style={{
        position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")`,
      }} />}

      {/* Pendant orb — dangles on mouse, click to toggle theme */}
      <PendantOrb
        accent={palette.accent}
        muted={palette.muted}
        theme={theme}
        onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: 80 * density, position: 'relative', zIndex: 2, display: page === 'home' ? 'block' : 'none' }}>
        <h1 style={{
          fontFamily: fonts.display, fontSize: 'clamp(48px, 7vw, 96px)',
          fontWeight: 600, letterSpacing: '-0.02em', margin: 0,
          color: palette.fg, textWrap: 'balance',
        }}>{data.name}</h1>
        <p style={{ fontSize: 16, color: palette.muted, marginTop: 12, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          {data.role}
        </p>
      </header>

      {/* Card grid */}
      <main style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 2,
        display: page === 'home' ? 'grid' : 'none', gridTemplateColumns: '1.1fr 1.6fr 1.3fr', gap: 20 * density,
      }}>
        {/* About card (top-left) + Work (bottom-left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 * density }}>
          <Card style={cardStyleBase} accent={palette.accent} muted={palette.muted}
            onClick={() => setPage('about')} active={page === 'about'}>
            <CardIcon><PersonIcon /></CardIcon>
            <CardTitle font={fonts.display}>About</CardTitle>
            <CardSub muted={palette.muted}>{data.about.short}</CardSub>
            <Sparkline accent={palette.accent} kind="about" />
          </Card>
          <Card style={cardStyleBase} accent={palette.accent} muted={palette.muted}
            onClick={() => setPage('work')} active={page === 'work'}>
            <CardIcon><BriefcaseIcon /></CardIcon>
            <CardTitle font={fonts.display}>Work</CardTitle>
            <CardSub muted={palette.muted}>{data.experience.length} roles · Qualcomm, Stryker</CardSub>
            <WorkPreview exp={data.experience} accent={palette.accent} muted={palette.muted} />
          </Card>
        </div>

        {/* Projects (large center) */}
        <Card style={{ ...cardStyleBase, minHeight: 320 }} accent={palette.accent} muted={palette.muted}
          onClick={() => setPage('projects')} active={page === 'projects'} large>
          <ProjectMarquee projects={data.projects} accent={palette.accent} muted={palette.muted} surface={palette.surface} border={palette.border} />
          <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
            <CardIcon><FolderIcon /></CardIcon>
            <CardTitle font={fonts.display}>Projects</CardTitle>
            <CardSub muted={palette.muted}>{data.projects.length} things I've shipped recently.</CardSub>
          </div>
        </Card>

        {/* Contact (right) */}
        <Card style={{ ...cardStyleBase, minHeight: 320 }} accent={palette.accent} muted={palette.muted}
          onClick={() => setPage('contact')} active={page === 'contact'}>
          <ContactDoodle accent={palette.accent} muted={palette.muted} surface={palette.surface} />
          <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
            <CardIcon><SendIcon /></CardIcon>
            <CardTitle font={fonts.display}>Contact</CardTitle>
            <CardSub muted={palette.muted}>Email, LinkedIn, GitHub.</CardSub>
          </div>
        </Card>
      </main>

      {/* Detail page (full-page replacement) */}
      {page !== 'home' && (
        <DetailPage
          which={page}
          data={data}
          palette={palette}
          fonts={fonts}
          onNavigate={setPage}
          scrollRef={detailScrollRef}
        />
      )}

      {/* Chat bar (only on home) */}
      {page === 'home' && (
        <ChatBar
          position={tweaks.chatPos || 'bottom'}
          messages={messages}
          sending={sending}
          input={input}
          setInput={setInput}
          onSubmit={onSubmit}
          starters={data.starters}
          onStarter={(s) => { send(s); }}
          scrollRef={scrollRef}
          palette={palette}
          fonts={fonts}
          botName="PravGPT"
        />
      )}

      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px ${palette.accent}80; }
          50% { transform: scale(1.15); box-shadow: 0 0 30px ${palette.accent}cc; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

// --- Sub-components ---

const StarField = ({ accent }) => {
  const stars = React.useMemo(() => Array.from({ length: 80 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    bright: Math.random() > 0.92,
  })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: '50%',
          background: s.bright ? accent : '#fff',
          opacity: 0.4, animation: `twinkle ${3 + s.delay}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
};

const Card = ({ children, style, onClick, active, large, accent, muted }) => (
  <button onClick={onClick} style={{
    ...style,
    borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden',
    cursor: 'pointer', textAlign: 'left', color: 'inherit', font: 'inherit',
    minHeight: large ? 320 : 150,
    transition: 'transform 200ms ease, border-color 200ms ease',
    transform: active ? 'translateY(-2px)' : 'none',
    borderColor: active ? accent : undefined,
    boxShadow: active ? `0 0 0 1px ${accent}40, 0 8px 32px rgba(0,0,0,0.4)` : 'none',
  }}>{children}</button>
);

const CardIcon = ({ children }) => (
  <div style={{ width: 28, height: 28, marginBottom: 12, opacity: 0.9 }}>{children}</div>
);

const CardTitle = ({ children, font }) => (
  <h2 style={{ fontFamily: font, fontSize: 28, fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.01em' }}>{children}</h2>
);

const CardSub = ({ children, muted }) => (
  <p style={{ fontSize: 14, color: muted, margin: 0, lineHeight: 1.5 }}>{children}</p>
);

const PersonIcon = () => (<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>);
const BriefcaseIcon = () => (<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>);
const FolderIcon = () => (<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>);
const SendIcon = () => (<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m3 11 18-8-8 18-2-8-8-2z"/></svg>);
const MicIcon = () => (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>);
const CloseIcon = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M6 18 18 6"/></svg>);

// Tiny "what's been happening" sparkline behind About card
const Sparkline = ({ accent, kind }) => (
  <svg viewBox="0 0 100 24" style={{ position: 'absolute', right: 16, top: 16, width: 80, height: 24, opacity: 0.5 }}>
    <polyline points="0,18 12,12 24,16 36,8 48,14 60,4 72,10 84,6 100,2"
      fill="none" stroke={accent} strokeWidth="1.5" />
  </svg>
);

const WorkPreview = ({ exp, accent, muted }) => (
  <div style={{ display: 'flex', gap: 6, marginTop: 16, alignItems: 'center' }}>
    {exp.map((e, i) => (
      <React.Fragment key={i}>
        <div style={{
          fontSize: 11, padding: '4px 10px', borderRadius: 999,
          background: i === 0 ? `${accent}25` : 'rgba(255,255,255,0.05)',
          color: i === 0 ? accent : muted, fontWeight: 500,
        }}>{e.company}</div>
        {i < exp.length - 1 && <div style={{ width: 8, height: 1, background: muted, opacity: 0.4 }} />}
      </React.Fragment>
    ))}
  </div>
);

// Marquee strip of project tiles for the Projects card
const ProjectMarquee = ({ projects, accent, muted, surface, border }) => {
  const tiles = [...projects, ...projects]; // duplicate for seamless loop
  return (
    <div style={{
      position: 'absolute', top: 24, left: 0, right: 0, height: 140,
      maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', gap: 16, padding: '0 24px',
        animation: 'marquee 30s linear infinite',
        width: 'max-content',
      }}>
        {tiles.map((p, i) => (
          <div key={i} style={{
            width: 140, height: 140, borderRadius: 14, flexShrink: 0,
            background: `linear-gradient(135deg, ${surface}, ${border})`,
            border: `1px solid ${border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: 28, marginBottom: 8, color: accent, fontWeight: 700, fontFamily: 'serif' }}>
                {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.3 }}>{p.tagline}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
};

// Animated chat bubble doodle for Contact card
// Animated chat conversation doodle for Contact card.
// Always 4 visible messages (2 blue incoming, 2 green outgoing, alternating).
// On each tick, a new message slides in from the bottom and the oldest
// slides off the top — like an endless rotating chat scroll.
const ContactDoodle = ({ accent, muted, surface }) => {
  const ROW_H = 30;
  const VISIBLE = 4;
  const SIDES = ['in', 'out', 'in', 'out'];
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1400);
    return () => clearInterval(id);
  }, []);

  const bubbles = [];
  for (let i = 0; i < VISIBLE + 1; i++) {
    const streamIdx = tick + i;
    const side = SIDES[streamIdx % SIDES.length];
    bubbles.push({ key: streamIdx, side });
  }

  return (
    <div style={{ position: 'absolute', top: 24, right: 24, width: 200, height: VISIBLE * ROW_H, overflow: 'hidden' }}>
      <style>{`
        @keyframes vara-typing-pulse {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.55; }
          30% { transform: translateY(-2px); opacity: 1; }
        }
        @keyframes vara-chat-slide {
          0%   { transform: translateY(${ROW_H}px); }
          15%  { transform: translateY(${ROW_H}px); }
          100% { transform: translateY(0); }
        }
      `}</style>
      <div
        key={tick}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          animation: 'vara-chat-slide 1400ms ease both',
        }}
      >
        {bubbles.map((b, i) => {
          const isIn = b.side === 'in';
          const top = (i - 1) * ROW_H;
          const isNew = i === bubbles.length - 1;
          const width = 56;
          const right = isIn ? (i % 2 === 0 ? 60 : 70) : (i % 2 === 0 ? 0 : 20);
          const radius = isIn ? '12px 12px 12px 4px' : '12px 12px 4px 12px';
          const bg = isIn ? '#3b82f6' : '#22c55e';
          const opacity = i === 0 ? 0 : 1;
          return (
            <div
              key={b.key}
              style={{
                position: 'absolute', top, right, width, height: 22,
                borderRadius: radius, background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                opacity,
                transition: 'opacity 600ms ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
              }}
            >
              {[0, 1, 2].map(d => (
                <div
                  key={d}
                  style={{
                    width: 4, height: 4, borderRadius: '50%', background: '#fff',
                    opacity: isNew ? 0.6 : 0.95,
                    animation: isNew
                      ? `vara-typing-pulse 900ms ${d * 130}ms infinite ease-in-out`
                      : 'none',
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Detail page (full-page, with left sidebar nav) ---
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'person' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'work', label: 'Work', icon: 'briefcase' },
  { id: 'contact', label: 'Contact', icon: 'send' },
];

const NavIcon = ({ kind }) => {
  if (kind === 'home') return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>;
  if (kind === 'person') return <PersonIcon />;
  if (kind === 'folder') return <FolderIcon />;
  if (kind === 'briefcase') return <BriefcaseIcon />;
  if (kind === 'send') return <SendIcon />;
  return null;
};

const Sidebar = ({ active, onNavigate, palette, fonts }) => (
  <nav style={{
    position: 'fixed', left: 24, top: '50%', transform: 'translateY(-50%)',
    display: 'flex', flexDirection: 'column', gap: 8, zIndex: 10,
    background: `${palette.surface}cc`, backdropFilter: 'blur(8px)',
    border: `1px solid ${palette.border}`, borderRadius: 999, padding: 8,
  }}>
    {NAV_ITEMS.map(item => {
      const isActive = active === item.id;
      return (
        <button key={item.id} onClick={() => onNavigate(item.id)}
          aria-label={item.label} title={item.label}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: isActive ? palette.accent : 'transparent',
            color: isActive ? palette.bg : palette.muted,
            border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 200ms, color 200ms',
          }}
          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = palette.fg; }}
          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = palette.muted; }}
        >
          <div style={{ width: 20, height: 20 }}><NavIcon kind={item.icon} /></div>
        </button>
      );
    })}
  </nav>
);

const DetailPage = ({ which, data, palette, fonts, onNavigate, scrollRef }) => {
  const content = {
    about: <AboutDetail data={data} palette={palette} fonts={fonts} />,
    work: <WorkDetail data={data} palette={palette} fonts={fonts} />,
    projects: <ProjectsDetail data={data} palette={palette} fonts={fonts} />,
    contact: <ContactDetail data={data} palette={palette} fonts={fonts} />,
  }[which];
  const label = NAV_ITEMS.find(n => n.id === which)?.label || '';
  return (
    <div ref={scrollRef} style={{
      position: 'absolute', inset: 0, overflowY: 'auto', zIndex: 20,
      animation: 'fadePage 250ms ease',
    }}>
      <Sidebar active={which} onNavigate={onNavigate} palette={palette} fonts={fonts} />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 32px 80px' }}>
        <div style={{ fontSize: 11, color: palette.muted, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
          <button onClick={() => onNavigate('home')} style={{ background: 'transparent', border: 'none', color: palette.muted, cursor: 'pointer', padding: 0, font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}>Home</button>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: palette.accent }}>{label}</span>
        </div>
        {content}
      </div>
      <style>{`@keyframes fadePage { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

const SectionH = ({ children, font, accent }) => (
  <h2 style={{ fontFamily: font, fontSize: 36, fontWeight: 600, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
    {children}
  </h2>
);

const AboutDetail = ({ data, palette, fonts }) => (
  <div>
    <SectionH font={fonts.display}>About</SectionH>
    <p style={{ fontSize: 16, lineHeight: 1.7, color: palette.soft }}>{data.about.long}</p>
    <h3 style={{ fontSize: 14, color: palette.muted, marginTop: 32, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>The Specs</h3>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, lineHeight: 2, color: palette.softer }}>
      <li><span style={{ color: palette.muted }}>Location:</span> {data.location}</li>
      <li><span style={{ color: palette.muted }}>Email:</span> {data.email}</li>
      <li><span style={{ color: palette.muted }}>Citizenship:</span> {data.citizenship}</li>
    </ul>
    <h3 style={{ fontSize: 14, color: palette.muted, marginTop: 32, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Education</h3>
    {data.education.map((e, i) => (
      <div key={i} style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{e.school}</div>
        <div style={{ fontSize: 13, color: palette.muted }}>{e.degree} · {e.dates}</div>
      </div>
    ))}
    <h3 style={{ fontSize: 14, color: palette.muted, marginTop: 24, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tech Stack</h3>
    {Object.entries(data.skills).map(([k, v]) => (
      <div key={k} style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: palette.accent, marginBottom: 6, fontWeight: 500 }}>{k}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {v.map((s, i) => (
            <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: palette.bg, border: `1px solid ${palette.border}`, color: palette.softer }}>{s}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const WorkDetail = ({ data, palette, fonts }) => (
  <div>
    <SectionH font={fonts.display}>Work</SectionH>
    {data.experience.map((e, i) => (
      <div key={i} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: i < data.experience.length - 1 ? `1px solid ${palette.border}` : 'none' }}>
        <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: palette.accent, color: palette.bg, fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
          {e.company}
        </div>
        <h3 style={{ fontSize: 18, margin: '0 0 4px', fontWeight: 600 }}>{e.title}</h3>
        <div style={{ fontSize: 13, color: palette.muted, marginBottom: 16 }}>{e.dates} · {e.location}</div>
        <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14, lineHeight: 1.7, color: palette.softer }}>
          {e.highlights.map((h, j) => <li key={j} style={{ marginBottom: 8 }}>{h}</li>)}
        </ul>
      </div>
    ))}
  </div>
);

const ProjectsDetail = ({ data, palette, fonts }) => (
  <div>
    <SectionH font={fonts.display}>Projects</SectionH>
    {data.projects.map((p, i) => (
      <div key={i} style={{ marginBottom: 24, padding: 20, background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <h3 style={{ fontSize: 20, margin: 0, fontWeight: 600, fontFamily: fonts.display }}>{p.name}</h3>
          {p.url && <a href={`https://${p.url}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: palette.accent }}>{p.url} ↗</a>}
        </div>
        <div style={{ fontSize: 13, color: palette.muted, marginBottom: 10 }}>{p.tagline}</div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: palette.softer, margin: '0 0 12px' }}>{p.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {p.stack.map((s, j) => (
            <span key={j} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: palette.surface, border: `1px solid ${palette.border}`, color: palette.muted }}>{s}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ContactDetail = ({ data, palette, fonts }) => (
  <div>
    <SectionH font={fonts.display}>Get in Touch</SectionH>
    <p style={{ fontSize: 15, color: palette.softer, lineHeight: 1.6, marginBottom: 24 }}>
      Best way to reach me is email — I respond within a day or two.
    </p>
    <div style={{ display: 'grid', gap: 12 }}>
      <ContactRow label="Email" value={data.contact.email} palette={palette} />
      <ContactRow label="LinkedIn" value={data.contact.linkedin} palette={palette} />
      <ContactRow label="GitHub" value={data.contact.github} palette={palette} />
      <ContactRow label="Website" value={data.contact.website} palette={palette} />
      <ContactRow label="Phone" value={data.contact.phone} palette={palette} />
    </div>
  </div>
);

const ContactRow = ({ label, value, palette }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 10 }}>
    <span style={{ fontSize: 13, color: palette.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
    <span style={{ fontSize: 14, color: palette.fg }}>{value}</span>
  </div>
);

// --- Chat bar (shared layout, stylable) ---
const ChatBar = ({ position, messages, sending, input, setInput, onSubmit, starters, onStarter, scrollRef, palette, fonts, botName }) => {
  const isTop = position === 'top';
  const hasConversation = messages.length > 0;
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0,
      [isTop ? 'top' : 'bottom']: 0, zIndex: 50,
      padding: '16px 24px', pointerEvents: 'none',
    }}>
      <div style={{
        maxWidth: 880, margin: '0 auto', pointerEvents: 'auto',
      }}>
        {hasConversation && (
          <div ref={scrollRef} style={{
            maxHeight: 240, overflowY: 'auto', marginBottom: 10,
            background: `${palette.surface}f0`, backdropFilter: 'blur(16px)',
            border: `1px solid ${palette.border}`, borderRadius: 14, padding: 18,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 10,
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: 12, fontSize: 14, lineHeight: 1.5,
                  background: m.role === 'user' ? palette.accent : palette.bg,
                  color: m.role === 'user' ? palette.bg : palette.soft,
                  border: m.role === 'assistant' ? `1px solid ${palette.border}` : 'none',
                }}>
                  {m.pending ? <TypingDots accent={palette.muted} /> : m.content}
                </div>
              </div>
            ))}
          </div>
        )}
        {!hasConversation && (
          <div style={{ textAlign: 'center', marginBottom: 12, color: palette.muted, fontSize: 13 }}>
            Ask {botName}
          </div>
        )}
        {!hasConversation && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
            {starters.slice(0, 4).map((s, i) => (
              <button key={i} onClick={() => onStarter(s)} style={{
                fontSize: 12, padding: '6px 12px', borderRadius: 999,
                background: `${palette.surface}cc`, backdropFilter: 'blur(8px)',
                border: `1px solid ${palette.border}`, color: palette.muted,
                cursor: 'pointer', transition: 'all 150ms', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = palette.accent; e.currentTarget.style.borderColor = palette.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = palette.muted; e.currentTarget.style.borderColor = palette.border; }}
              >{s}</button>
            ))}
          </div>
        )}
        <form onSubmit={onSubmit} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: palette.surface, border: `1px solid ${palette.border}`,
          borderRadius: 14, padding: '5px 5px 5px 18px',
          boxShadow: palette.theme === 'light' ? '0 6px 20px rgba(0,0,0,0.08)' : '0 6px 20px rgba(0,0,0,0.35)',
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you like to know?"
            disabled={sending}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: palette.fg, fontSize: 14, padding: '10px 0', fontFamily: 'inherit',
            }}
          />
          <button type="submit" disabled={!input.trim() || sending} style={{
            background: input.trim() && !sending ? palette.accent : `${palette.accent}40`,
            color: palette.bg, border: 'none', borderRadius: 8, padding: 8,
            cursor: input.trim() && !sending ? 'pointer' : 'default', display: 'flex', alignItems: 'center',
            transition: 'transform 100ms',
          }}><div style={{ width: 16, height: 16 }}><SendIcon /></div></button>
        </form>
      </div>
    </div>
  );
};

const TypingDots = ({ accent }) => (
  <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
    {[0, 1, 2].map(i => (
      <span key={i} style={{
        width: 6, height: 6, borderRadius: '50%', background: accent,
        animation: `dot 1.4s ease-in-out ${i * 0.16}s infinite`,
      }} />
    ))}
    <style>{`@keyframes dot { 0%, 80%, 100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }`}</style>
  </span>
);

window.VarA = VarA;

// --- PendantOrb: a chain hanging from the top with an orb at the end.
// The chain swings/dangles based on mouse movement, and clicking the orb toggles theme.
const PendantOrb = ({ accent, muted, theme, onToggle }) => {
  const ANCHOR_X = 'calc(100% - 88px)'; // visual anchor near top-right
  const CHAIN_LEN = 84; // base length in px (number of beads * spacing)
  const BEAD_COUNT = 18;

  // Physics state for the orb (swinging pendulum)
  const [angle, setAngle] = React.useState(0); // current angle in radians
  const angleRef = React.useRef(0);
  const velRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const rafRef = React.useRef(0);
  const anchorRef = React.useRef({ x: 0, y: 0 });
  const wrapperRef = React.useRef(null);

  // Update anchor position on mount + resize so we know where the pivot is
  React.useEffect(() => {
    const updateAnchor = () => {
      if (wrapperRef.current) {
        const r = wrapperRef.current.getBoundingClientRect();
        anchorRef.current = { x: r.left + r.width / 2, y: r.top };
      }
    };
    updateAnchor();
    window.addEventListener('resize', updateAnchor);
    window.addEventListener('scroll', updateAnchor, true);
    return () => {
      window.removeEventListener('resize', updateAnchor);
      window.removeEventListener('scroll', updateAnchor, true);
    };
  }, []);

  // Mouse listener — compute target angle from the cursor's offset from the anchor.
  // The closer the mouse to the orb, the more it pulls the pendulum toward it.
  React.useEffect(() => {
    const onMove = (e) => {
      const { x: ax, y: ay } = anchorRef.current;
      const dx = e.clientX - ax;
      const dy = e.clientY - (ay + CHAIN_LEN);
      const dist = Math.hypot(dx, dy);
      // Influence falls off with distance; max ~140px range
      const influence = Math.max(0, 1 - dist / 260);
      // Angle from vertical (negative because we want the chain to lean toward cursor)
      const targetAngle = Math.atan2(dx, Math.max(40, dy + 60)) * 0.6 * influence;
      // Clamp
      targetRef.current = Math.max(-0.7, Math.min(0.7, targetAngle));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Spring physics loop: damped harmonic oscillator
  React.useEffect(() => {
    const STIFFNESS = 0.06;
    const DAMPING = 0.86;
    const tick = () => {
      const a = angleRef.current;
      const v = velRef.current;
      const t = targetRef.current;
      const force = (t - a) * STIFFNESS;
      const newV = (v + force) * DAMPING;
      const newA = a + newV;
      angleRef.current = newA;
      velRef.current = newV;
      // Only re-render if there's meaningful motion to avoid wasted work
      if (Math.abs(newV) > 0.0002 || Math.abs(t - newA) > 0.0005) {
        setAngle(newA);
      } else {
        angleRef.current = t;
        setAngle(t);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Convert angle -> bead positions along an arc
  const beads = [];
  for (let i = 0; i < BEAD_COUNT; i++) {
    // Each bead's distance from the pivot
    const t = (i + 1) / BEAD_COUNT;
    // Subtle 'rope sag' — beads further down respond more to the angle
    const beadAngle = angle * Math.pow(t, 0.7);
    const distance = t * CHAIN_LEN;
    const x = Math.sin(beadAngle) * distance;
    const y = Math.cos(beadAngle) * distance;
    beads.push({ x, y });
  }
  const orbT = 1.0;
  const orbAngle = angle * Math.pow(orbT, 0.7);
  const orbX = Math.sin(orbAngle) * (CHAIN_LEN + 12);
  const orbY = Math.cos(orbAngle) * (CHAIN_LEN + 12);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        top: 0,
        left: ANCHOR_X,
        width: 1, height: CHAIN_LEN + 40,
        zIndex: 5, pointerEvents: 'none',
      }}
    >
      {/* Pivot point dot */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 6, height: 6,
        borderRadius: '50%', background: muted, opacity: 0.6,
        transform: 'translate(-50%, -50%)',
      }} />
      {/* Chain beads */}
      {beads.map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: b.x, top: b.y,
          width: 4, height: 4, borderRadius: '50%',
          background: muted, opacity: 0.55,
          transform: 'translate(-50%, -50%)',
        }} />
      ))}
      {/* Lightbulb (interactive) */}
      <button
        onClick={onToggle}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{
          position: 'absolute',
          left: orbX, top: orbY,
          width: 36, height: 48,
          background: 'transparent', border: 'none', cursor: 'pointer',
          transform: 'translate(-50%, -38%)',
          pointerEvents: 'auto',
          padding: 0,
          transition: 'filter 400ms ease',
          filter: theme === 'light'
            ? 'drop-shadow(0 0 18px rgba(255,210,90,0.95)) drop-shadow(0 0 36px rgba(255,180,40,0.55))'
            : 'drop-shadow(0 0 4px rgba(0,0,0,0.4))',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -38%) scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -38%) scale(1)'; }}
      >
        <svg viewBox="0 0 36 48" width="36" height="48" style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <radialGradient id="bulbGlow" cx="50%" cy="55%" r="55%">
              <stop offset="0%" stopColor={theme === 'light' ? '#fff5c2' : '#3a3a3a'} />
              <stop offset="55%" stopColor={theme === 'light' ? '#ffd34d' : '#2a2a2a'} />
              <stop offset="100%" stopColor={theme === 'light' ? '#f5a623' : '#1a1a1a'} />
            </radialGradient>
          </defs>
          {/* Cap (screw base) */}
          <rect x="13" y="2" width="10" height="3" rx="1" fill={muted} opacity="0.85" />
          <rect x="12" y="5" width="12" height="2" fill={muted} opacity="0.7" />
          <rect x="12" y="8" width="12" height="2" fill={muted} opacity="0.7" />
          <rect x="13" y="11" width="10" height="3" rx="1" fill={muted} opacity="0.85" />
          {/* Glass bulb */}
          <path
            d="M 11 14 Q 11 18 14 22 Q 18 28 18 34 Q 18 38 14 38 L 22 38 Q 18 38 18 34 Q 18 28 22 22 Q 25 18 25 14 Z"
            fill="url(#bulbGlow)"
            stroke={theme === 'light' ? '#ffe680' : '#444'}
            strokeWidth="0.5"
          />
          {/* Filament */}
          <path
            d="M 14 24 Q 15 22 16 24 Q 17 26 18 24 Q 19 22 20 24 Q 21 26 22 24"
            fill="none"
            stroke={theme === 'light' ? '#fff8d0' : '#666'}
            strokeWidth="0.8"
            opacity={theme === 'light' ? 1 : 0.7}
          />
          {/* Highlight */}
          {theme === 'light' && (
            <ellipse cx="14" cy="20" rx="2" ry="3.5" fill="#fffbe6" opacity="0.65" />
          )}
        </svg>
      </button>
    </div>
  );
};
