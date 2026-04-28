import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0b0d',
      color: '#e8eaf0',
      fontFamily: "'Instrument Sans', system-ui, sans-serif",
      overflowX: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --gold:#c9a84c;--gd:rgba(201,168,76,.1);--gd2:rgba(201,168,76,.06);
          --teal:#2dd4bf;--bg2:#111318;--bg3:#181c23;
          --b:rgba(255,255,255,.06);--b2:rgba(255,255,255,.11);
          --t2:#8a93a8;--t3:#4a5568;
          --serif:'Playfair Display',serif;
          --mono:'JetBrains Mono',monospace;
        }
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .fa{animation:fadeUp .6s cubic-bezier(.22,1,.36,1) both}
        .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.19s}.d4{animation-delay:.26s}.d5{animation-delay:.33s}
        .ldot{width:6px;height:6px;border-radius:50%;background:var(--gold);display:inline-block;animation:pulse 2s ease-in-out infinite}
        .nav{position:sticky;top:0;z-index:100;height:54px;display:flex;align-items:center;padding:0 32px;background:rgba(10,11,13,.92);border-bottom:1px solid var(--b);backdrop-filter:blur(20px);justify-content:space-between}
        .nav-logo{font-family:var(--serif);font-size:18px;font-weight:700;color:#e8eaf0;letter-spacing:-.02em;text-decoration:none}
        .nav-logo span{color:var(--gold)}
        .nav-right{display:flex;gap:10px;align-items:center}
        .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:4px;font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;text-decoration:none;border:1px solid var(--b2);background:rgba(255,255,255,.04);color:var(--t2)}
        .btn:hover{background:rgba(255,255,255,.08);color:#e8eaf0}
        .btn-gold{background:var(--gold);border-color:var(--gold);color:#0a0b0d;font-weight:700}
        .btn-gold:hover{background:#b8973e;color:#0a0b0d}
        .btn-lg{padding:14px 32px;font-size:15px;border-radius:5px;font-family:var(--serif);font-weight:700}
        .hero{max-width:1240px;margin:0 auto;padding:0 32px;display:grid;grid-template-columns:1fr 380px;border-bottom:1px solid var(--b)}
        .hero-left{padding:80px 56px 80px 0;border-right:1px solid var(--b)}
        .hero-ey{display:flex;align-items:center;gap:10px;margin-bottom:28px;font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
        .hero-ey-line{width:24px;height:1px;background:var(--gold)}
        .h1{font-family:var(--serif);font-size:clamp(52px,6vw,82px);font-weight:800;line-height:.92;letter-spacing:-.025em;color:#e8eaf0;margin-bottom:22px}
        .h1 .it{font-style:italic;color:var(--gold)}
        .h1 .gh{-webkit-text-stroke:1px rgba(232,234,240,.2);color:transparent;display:block}
        .hero-sub{font-size:15px;color:var(--t2);line-height:1.78;max-width:520px;margin-bottom:36px}
        .hero-ctas{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}
        .hero-note{font-family:var(--mono);font-size:11px;color:var(--t3);display:flex;gap:18px}
        .hero-note span::before{content:'--';margin-right:5px;color:var(--t3)}
        .hero-right{padding:32px 28px;background:var(--bg2)}
        .hr-title{font-family:var(--mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--t3);margin-bottom:22px;display:flex;align-items:center;gap:8px}
        .hr-title::before{content:'';width:14px;height:1px;background:var(--gold)}
        .stat-row{padding:16px 0;border-bottom:1px solid var(--b)}
        .stat-row:last-child{border-bottom:none;padding-bottom:0}
        .stat-num{font-family:var(--serif);font-size:40px;font-weight:700;letter-spacing:-.03em;line-height:1;margin-bottom:4px;color:#e8eaf0}
        .stat-num .gc{color:var(--gold)}
        .stat-desc{font-size:11px;color:var(--t2);line-height:1.5}
        .stat-tr{font-family:var(--mono);font-size:10px;color:var(--gold);margin-top:5px}
        .proof{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--b);max-width:none}
        .pi{padding:22px 32px;border-right:1px solid var(--b);position:relative;overflow:hidden;transition:background .18s;cursor:default}
        .pi:last-child{border-right:none}
        .pi:hover{background:rgba(201,168,76,.03)}
        .pi::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--teal));opacity:0;transition:opacity .22s}
        .pi:hover::before{opacity:1}
        .pn{font-family:var(--serif);font-size:28px;font-weight:700;color:var(--gold);margin-bottom:4px;letter-spacing:-.02em;line-height:1}
        .pd{font-family:var(--mono);font-size:10px;color:var(--t3);line-height:1.5}
        .section{max-width:1240px;margin:0 auto;padding:72px 32px}
        .section.pt0{padding-top:0}
        .sec-ey{display:flex;align-items:center;gap:10px;margin-bottom:12px;font-family:var(--mono);font-size:10px;color:var(--gold);letter-spacing:.1em}
        .sec-num{font-family:var(--mono);font-size:10px;color:var(--gold);letter-spacing:.1em}
        .sec-line{width:30px;height:1px;background:var(--b2)}
        .sec-h{font-family:var(--serif);font-size:clamp(28px,3.5vw,42px);font-weight:700;letter-spacing:-.02em;color:#e8eaf0;margin-bottom:10px;line-height:1.1}
        .sec-p{font-size:14px;color:var(--t2);max-width:500px;line-height:1.78;margin-bottom:40px}
        .steps{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--b);border-radius:4px;overflow:hidden}
        .step{padding:28px 24px;border-right:1px solid var(--b);background:var(--bg2);transition:background .18s}
        .step:last-child{border-right:none}
        .step:hover{background:var(--bg3)}
        .step-num{font-family:var(--mono);font-size:10px;color:var(--gold);letter-spacing:.1em;margin-bottom:16px;display:flex;align-items:center;gap:8px}
        .step-num::after{content:'';flex:1;height:1px;background:var(--b)}
        .step h4{font-family:var(--serif);font-size:17px;font-weight:700;color:#e8eaf0;margin-bottom:7px}
        .step p{font-size:12px;color:var(--t2);line-height:1.65}
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--b);border:1px solid var(--b);border-radius:4px;overflow:hidden}
        .fc{padding:28px 26px;background:var(--bg2);transition:background .18s}
        .fc:hover{background:var(--bg3)}
        .fc-icon{width:32px;height:32px;border-radius:3px;background:var(--gd);border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:16px}
        .fc h3{font-family:var(--serif);font-size:16px;font-weight:700;color:#e8eaf0;margin-bottom:7px}
        .fc p{font-size:12px;color:var(--t2);line-height:1.65}
        .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--b);border:1px solid var(--b);border-radius:4px;overflow:hidden}
        .plan{padding:32px 28px;background:var(--bg2);display:flex;flex-direction:column;gap:20px;position:relative;overflow:hidden;transition:background .18s}
        .plan:hover{background:var(--bg3)}
        .plan.feat{background:var(--bg3)}
        .plan-bar{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--teal));opacity:0}
        .plan.feat .plan-bar{opacity:1}
        .plan-tier{font-family:var(--mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--t3)}
        .plan-name{font-family:var(--serif);font-size:22px;font-weight:700;color:#e8eaf0}
        .plan-price{font-family:var(--serif);font-size:48px;font-weight:700;letter-spacing:-.03em;line-height:1;color:#e8eaf0}
        .plan-price sub{font-family:'Instrument Sans',sans-serif;font-size:14px;font-weight:400;color:var(--t2);vertical-align:bottom}
        .plan-desc{font-size:12px;color:var(--t2);line-height:1.65;padding-top:4px;border-top:1px solid var(--b)}
        .plan-feats{display:flex;flex-direction:column;gap:8px}
        .pf{display:flex;gap:8px;font-size:12px;color:var(--t2)}
        .pf-ck{color:var(--gold);flex-shrink:0;font-size:11px;margin-top:1px}
        .pf.dim{opacity:.28}
        .plan-pop{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:var(--gd);border:1px solid rgba(201,168,76,.2);border-radius:3px;font-family:var(--mono);font-size:9px;color:var(--gold);letter-spacing:.08em;text-transform:uppercase;margin-bottom:-5px}
        .hftr{padding:24px 32px;border-top:1px solid var(--b);display:flex;align-items:center;justify-content:space-between;max-width:1240px;margin:0 auto;flex-wrap:wrap;gap:12px}
        .hf-logo{font-family:var(--serif);font-size:14px;font-weight:700;color:var(--t2)}
        .hf-links{display:flex;gap:20px}
        .hf-links a{font-family:var(--mono);font-size:10px;color:var(--t3);text-decoration:none;transition:color .14s}
        .hf-links a:hover{color:var(--gold)}
        @media(max-width:768px){
          .hero{grid-template-columns:1fr}
          .hero-right{display:none}
          .hero-left{padding:48px 0;border-right:none}
          .proof{grid-template-columns:1fr 1fr}
          .steps{grid-template-columns:1fr 1fr}
          .feat-grid{grid-template-columns:1fr}
          .pgrid{grid-template-columns:1fr}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">LeadHunter <span>Pro</span></a>
        <div className="nav-right">
          <Link href="/login" className="btn">Sign in</Link>
          <Link href="/login" className="btn btn-gold">Start Free Trial</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{maxWidth:'1240px',margin:'0 auto',padding:'0 32px'}}>
        <div className="hero" style={{margin:'0',padding:'0',maxWidth:'none'}}>
          <div className="hero-left">
            <div className="hero-ey fa d1"><span className="hero-ey-line"></span><span className="ldot" style={{marginRight:'6px'}}></span>Live intelligence platform &middot; Miami, FL</div>
            <h1 className="h1 fa d2">Find local <span className="it">businesses</span><span className="gh">without sites.</span></h1>
            <p className="hero-sub fa d3">Search any city or ZIP. Every listing scored 0&ndash;100 for no-website confidence. Generate developer briefs and complete sales pitch packs in under 60 seconds &mdash; then sell the AI tools that generate recurring monthly revenue.</p>
            <div className="hero-ctas fa d4">
              <Link href="/login" className="btn btn-gold btn-lg">Start Hunting Free</Link>
              <a href="#pricing" className="btn btn-lg" style={{borderColor:'rgba(255,255,255,.18)',color:'#e8eaf0'}}>View Pricing</a>
            </div>
            <div className="hero-note fa d5">
              <span>2 free searches</span>
              <span>No credit card</span>
              <span>Cancel anytime</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="hr-title">Live platform metrics</div>
            <div className="stat-row"><div className="stat-num"><span className="gc">2,411</span></div><div className="stat-desc">Active users finding leads daily</div><div className="stat-tr">+134 this week</div></div>
            <div className="stat-row"><div className="stat-num">$1.2M<span style={{fontSize:'20px',fontWeight:400,color:'var(--t2)'}}>+</span></div><div className="stat-desc">In deals closed via the platform</div><div className="stat-tr">Running total</div></div>
            <div className="stat-row"><div className="stat-num"><span className="gc">38</span><span style={{fontSize:'22px',fontWeight:400,color:'var(--gold)'}}>%</span></div><div className="stat-desc">of US small businesses have no real website</div><div className="stat-tr" style={{color:'var(--gold)'}}>Your addressable market</div></div>
            <div className="stat-row"><div className="stat-num">4.9<span style={{fontSize:'22px',color:'var(--gold)'}}>*</span></div><div className="stat-desc">Average rating from active subscribers</div></div>
          </div>
        </div>
      </div>

      {/* PROOF */}
      <div className="proof">
        <div className="pi"><div className="pn">$100</div><div className="pd">Pro plan &mdash; recoups with a single client</div></div>
        <div className="pi"><div className="pn">60s</div><div className="pd">Average time to generate full pitch pack</div></div>
        <div className="pi"><div className="pn">$6.7K</div><div className="pd">Year-one value per client: site + 3 AI tools</div></div>
        <div className="pi"><div className="pn">12</div><div className="pd">Sellable AI tools with monthly recurring revenue</div></div>
      </div>

      {/* STEPS */}
      <div className="section">
        <div className="sec-ey"><span className="sec-num">01</span><span className="sec-line"></span></div>
        <h2 className="sec-h">Zero to closed deal in four moves.</h2>
        <p className="sec-p">The complete operating playbook. From identifying the cold lead to collecting recurring monthly revenue.</p>
        <div className="steps">
          <div className="step"><div className="step-num">Step 01</div><h4>Identify the lead</h4><p>Search any city and business type. The platform scores every listing for no-website confidence using five independent signals.</p></div>
          <div className="step"><div className="step-num">Step 02</div><h4>Generate the pitch</h4><p>One click produces a complete developer brief, call script, cold email, and SMS &mdash; all written by Claude AI instantly.</p></div>
          <div className="step"><div className="step-num">Step 03</div><h4>Close the project</h4><p>Call or email using the generated pitch. Build the site from the AI brief. Standard project fee: $800&ndash;$1,500.</p></div>
          <div className="step"><div className="step-num">Step 04</div><h4>Stack recurring tools</h4><p>Upsell two to three AI tools at $79&ndash;$299 per month each. Year-one value per client exceeds $6,700.</p></div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="section pt0">
        <div className="sec-ey"><span className="sec-num">02</span><span className="sec-line"></span></div>
        <h2 className="sec-h">Every tool you need to find, pitch, and close.</h2>
        <div className="feat-grid">
          <div className="fc"><div className="fc-icon">&#9906;</div><h3>No-Website Lead Finder</h3><p>Scans Google Places and cross-references domain registries. Returns leads ranked by no-website confidence score from 0 to 100.</p></div>
          <div className="fc"><div className="fc-icon">&#9703;</div><h3>Outdated Site Detector</h3><p>Identifies businesses with sites 10 or more years old. Slow, insecure, non-responsive. Prime rebuild candidates with built-in urgency.</p></div>
          <div className="fc"><div className="fc-icon">&#9998;</div><h3>AI Developer Briefs</h3><p>Copy-paste-ready project briefs. Complete technical scope, design direction, and feature list. Generated in under 30 seconds.</p></div>
          <div className="fc"><div className="fc-icon">&#9742;</div><h3>Full Pitch Pack</h3><p>Claude AI writes a personalized call script, cold email with subject line, and SMS for every lead. Ready to deploy immediately.</p></div>
          <div className="fc"><div className="fc-icon">&#9698;</div><h3>Real Estate Intelligence</h3><p>Behavioral intent signals from Zillow, Realtor.com, and Redfin. Identify active buyers before they contact any agent.</p></div>
          <div className="fc"><div className="fc-icon">&#9783;</div><h3>CSV Export and CRM Integration</h3><p>Export every search with full lead details, confidence scores, contact data, and review excerpts. Imports into any CRM.</p></div>
        </div>
      </div>

      {/* PRICING */}
      <div className="section pt0" id="pricing">
        <div className="sec-ey" style={{justifyContent:'center',display:'flex'}}><span className="sec-num">03</span><span className="sec-line"></span></div>
        <h2 className="sec-h" style={{textAlign:'center'}}>Start free. Scale when you close.</h2>
        <p className="sec-p" style={{textAlign:'center',margin:'0 auto 28px'}}>No credit card required. Upgrade once your first project closes.</p>
        <div className="pgrid">
          <div className="plan"><div className="plan-bar"></div>
            <div><div className="plan-tier">Tier 01</div><div className="plan-name">Starter</div></div>
            <div className="plan-price">$0<sub>/mo</sub></div>
            <div className="plan-desc">Test the platform. Two searches included at no cost.</div>
            <div className="plan-feats"><div className="pf"><span className="pf-ck">+</span>2 lead searches total</div><div className="pf"><span className="pf-ck">+</span>Up to 10 leads per search</div><div className="pf"><span className="pf-ck">+</span>Confidence scores and contact info</div><div className="pf dim"><span className="pf-ck">-</span>Developer briefs and pitch packs</div><div className="pf dim"><span className="pf-ck">-</span>Outdated site detector</div></div>
            <Link href="/login" className="btn" style={{justifyContent:'center',padding:'12px'}}>Start for Free</Link>
          </div>
          <div className="plan feat"><div className="plan-bar"></div>
            <div><div className="plan-pop">Most Popular</div><div className="plan-tier" style={{marginTop:'8px'}}>Tier 02</div><div className="plan-name">Professional</div></div>
            <div className="plan-price">$100<sub>/mo</sub></div>
            <div className="plan-desc">For developers and agencies actively closing clients.</div>
            <div className="plan-feats"><div className="pf"><span className="pf-ck">+</span>45 searches per month</div><div className="pf"><span className="pf-ck">+</span>60 leads per search</div><div className="pf"><span className="pf-ck">+</span>AI developer brief generator</div><div className="pf"><span className="pf-ck">+</span>Full pitch pack per lead</div><div className="pf"><span className="pf-ck">+</span>Outdated site detector</div><div className="pf"><span className="pf-ck">+</span>CSV export and email enrichment</div></div>
            <Link href="/login" className="btn btn-gold" style={{justifyContent:'center',padding:'12px'}}>Start Professional &mdash; $100/mo</Link>
          </div>
          <div className="plan"><div className="plan-bar"></div>
            <div><div className="plan-tier">Tier 03</div><div className="plan-name">Enterprise</div></div>
            <div className="plan-price">$250<sub>/mo</sub></div>
            <div className="plan-desc">Unlimited capacity for high-volume agencies at scale.</div>
            <div className="plan-feats"><div className="pf"><span className="pf-ck">+</span>Unlimited searches</div><div className="pf"><span className="pf-ck">+</span>Everything in Professional</div><div className="pf"><span className="pf-ck">+</span>Complete AI Tools suite</div><div className="pf"><span className="pf-ck">+</span>White-label pitch materials</div><div className="pf"><span className="pf-ck">+</span>5 team seats and API access</div></div>
            <Link href="/login" className="btn" style={{justifyContent:'center',padding:'12px',borderColor:'rgba(255,255,255,.18)',color:'#e8eaf0'}}>Start Enterprise &mdash; $250/mo</Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{borderTop:'1px solid var(--b)'}}>
        <div className="hftr">
          <div className="hf-logo">LeadHunter Pro &mdash; Built in Miami &copy; 2025</div>
          <div className="hf-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div>
        </div>
      </div>
    </div>
  )
}
