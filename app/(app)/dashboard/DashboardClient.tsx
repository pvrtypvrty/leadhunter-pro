'use client'
import { useState, useEffect } from 'react'

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0b0d;--bg2:#111318;--bg3:#181c23;--bg4:#1e2430;
  --b:rgba(255,255,255,.06);--b2:rgba(255,255,255,.11);--b3:rgba(255,255,255,.18);
  --gold:#c9a84c;--gd:rgba(201,168,76,.12);--gd2:rgba(201,168,76,.06);
  --teal:#2dd4bf;--td:rgba(45,212,191,.1);
  --green:#4ade80;--red:#f87171;--blue:#60a5fa;
  --t:#e8eaf0;--t2:#8a93a8;--t3:#4a5568;
  --serif:'Playfair Display',serif;--sans:'Instrument Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
}
body{background:var(--bg);color:var(--t);font-family:var(--sans);font-size:13px;line-height:1.5;-webkit-font-smoothing:antialiased}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
.spinner{display:inline-block;width:13px;height:13px;border:1.5px solid rgba(255,255,255,.12);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite}
.ldot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 2.2s ease-in-out infinite;display:inline-block}
input,select{font-family:var(--sans);font-size:13px;width:100%;padding:9px 12px;border-radius:4px;border:1px solid var(--b2);background:var(--bg3);color:var(--t);outline:none;transition:border-color .14s,box-shadow .14s}
input:focus,select:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1)}
input::placeholder{color:var(--t3)}
select option{background:var(--bg3)}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:4px;border:1px solid var(--b2);background:rgba(255,255,255,.04);color:var(--t2);cursor:pointer;font-family:var(--sans);font-size:12px;font-weight:600;transition:all .15s;white-space:nowrap}
.btn:hover{background:rgba(255,255,255,.07);border-color:var(--b3);color:var(--t)}
.btn-gold{background:var(--gold);border-color:var(--gold);color:#0a0b0d;font-weight:700}
.btn-gold:hover{background:#b8973e;color:#0a0b0d}
.btn:disabled{opacity:.38;cursor:not-allowed}
.tag{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:3px;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.04em}
.tag-gold{background:var(--gd);color:var(--gold);border:1px solid rgba(201,168,76,.2)}
.tag-teal{background:var(--td);color:var(--teal);border:1px solid rgba(45,212,191,.2)}
.tag-gray{background:rgba(255,255,255,.05);color:var(--t2);border:1px solid var(--b)}
.chip{padding:4px 11px;background:rgba(255,255,255,.04);border:1px solid var(--b);border-radius:3px;font-size:11px;color:var(--t2);cursor:pointer;transition:all .12s;font-family:var(--mono);letter-spacing:.02em}
.chip:hover{background:var(--gd);border-color:rgba(201,168,76,.25);color:var(--gold)}
.nav{position:sticky;top:0;z-index:100;height:54px;display:flex;align-items:center;padding:0 0 0 28px;background:rgba(10,11,13,.92);border-bottom:1px solid var(--b);backdrop-filter:blur(20px)}
.ntab{padding:0 14px;height:54px;display:flex;align-items:center;font-size:12px;font-weight:500;color:var(--t2);cursor:pointer;border:none;background:none;border-bottom:1.5px solid transparent;transition:all .14s;white-space:nowrap;font-family:var(--sans)}
.ntab:hover{color:var(--t)}
.ntab.on{color:var(--gold);border-bottom-color:var(--gold)}
.ntab-badge{background:rgba(201,168,76,.15);color:var(--gold);font-size:9px;font-weight:600;padding:1px 5px;border-radius:3px;font-family:var(--mono);margin-left:4px}
.ntab-new{background:rgba(45,212,191,.12);color:var(--teal);font-size:9px;font-weight:600;padding:1px 5px;border-radius:3px;font-family:var(--mono);margin-left:4px}
.ntab-lock{background:rgba(248,113,113,.1);color:var(--red);font-size:9px;font-weight:600;padding:1px 5px;border-radius:3px;font-family:var(--mono);margin-left:4px}
.scr{display:none;min-height:calc(100vh - 54px)}
.scr.on{display:block;animation:fadeUp .4s cubic-bezier(.22,1,.36,1)}
.sl{display:grid;grid-template-columns:370px 1fr;min-height:calc(100vh - 54px)}
.sp{padding:28px 22px;border-right:1px solid var(--b);background:var(--bg2);display:flex;flex-direction:column;gap:18px;overflow-y:auto}
.sp-ey{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase}
.sp-title{font-family:var(--serif);font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.2;color:var(--t)}
.sp-title em{font-style:italic;color:var(--t2)}
.sp-desc{font-size:12px;color:var(--t2);line-height:1.72}
.sp-note{padding:10px 13px;background:rgba(201,168,76,.05);border-left:2px solid var(--gold);font-family:var(--mono);font-size:10px;color:var(--gold);line-height:1.6}
.run-btn{width:100%;padding:13px;border:none;border-radius:4px;font-family:var(--serif);font-size:15px;font-weight:700;cursor:pointer;transition:all .17s;display:flex;align-items:center;justify-content:center;gap:8px}
.run-btn:hover{filter:brightness(1.08);transform:translateY(-1px)}
.run-btn:disabled{opacity:.38;cursor:not-allowed;transform:none!important}
.sv{display:flex;align-items:center;justify-content:center;padding:48px;background:var(--bg);position:relative;overflow:hidden}
.sv::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.02) 1px,transparent 1px);background-size:60px 60px}
.sv::after{content:'';position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(201,168,76,.05) 0%,transparent 65%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
.vg{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--b);border:1px solid var(--b);max-width:420px;width:100%;position:relative;z-index:1;border-radius:4px;overflow:hidden}
.vc{padding:24px 20px;background:var(--bg2);text-align:center;transition:background .17s}
.vc:hover{background:var(--bg3)}
.vn{font-family:var(--serif);font-size:40px;font-weight:700;letter-spacing:-.03em;line-height:1;margin-bottom:8px}
.vd{font-size:11px;color:var(--t2);line-height:1.5}
.rtbar{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid var(--b);background:rgba(10,11,13,.9);backdrop-filter:blur(12px);position:sticky;top:54px;z-index:50;flex-wrap:wrap;gap:8px}
.rpill{display:flex;align-items:center;gap:5px;padding:3px 9px;background:var(--bg3);border:1px solid var(--b);border-radius:3px;font-family:var(--mono);font-size:10px;color:var(--t2)}
.rdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.rbody{padding:20px}
.lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1px;background:var(--b);border:1px solid var(--b);border-radius:4px;overflow:hidden}
.lcard{background:var(--bg2);padding:20px;display:flex;flex-direction:column;gap:12px;position:relative;overflow:hidden;transition:background .15s}
.lcard:hover{background:var(--bg3)}
.lcard-bar{position:absolute;top:0;left:0;right:0;height:2px}
.lctop{display:flex;align-items:flex-start;gap:11px}
.lc-ini{width:38px;height:38px;border-radius:3px;flex-shrink:0;background:var(--gd);border:1px solid rgba(201,168,76,.18);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:15px;font-weight:700;color:var(--gold)}
.lc-name{font-family:var(--serif);font-size:14px;font-weight:700;color:var(--t);margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lc-cat{font-family:var(--mono);font-size:10px;color:var(--t3)}
.lc-stars{font-family:var(--mono);font-size:11px;color:var(--gold);margin-left:auto;white-space:nowrap;flex-shrink:0}
.sc-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}
.sc-ring{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;border:1.5px solid;font-family:var(--mono)}
.sc-track{height:2px;background:var(--bg4);border-radius:1px;overflow:hidden}
.sc-fill{height:100%;border-radius:1px}
.reasons{display:flex;flex-direction:column;gap:3px}
.rsn{display:flex;align-items:flex-start;gap:7px;font-size:11px;color:var(--t2);line-height:1.55}
.cts{display:flex;flex-direction:column;gap:5px}
.ci{display:flex;align-items:flex-start;gap:8px;font-size:12px}
.cv{color:var(--t2);line-height:1.4;word-break:break-word}
.cv.lk{color:var(--gold);cursor:pointer}
.divline{height:1px;background:var(--b)}
.card-acts{display:flex;gap:7px}
.ca-btn{flex:1;padding:9px;font-family:var(--serif);font-size:12px;font-weight:700;border-radius:4px;cursor:pointer;transition:all .14s;text-align:center;border:none}
.ca-pri{background:var(--gold);color:#0a0b0d}
.ca-pri:hover{background:#b8973e}
.ca-sec{background:rgba(255,255,255,.05);border:1px solid var(--b);color:var(--t2)}
.ca-sec:hover{background:rgba(255,255,255,.08);color:var(--t)}
.tools-wrap{padding:44px 36px;max-width:1240px;margin:0 auto}
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px;background:var(--b);border:1px solid var(--b);border-radius:4px;overflow:hidden;margin-bottom:44px}
.tc{background:var(--bg2);padding:22px;display:flex;flex-direction:column;transition:background .16s;position:relative;overflow:hidden}
.tc:hover{background:var(--bg3)}
.tc::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:0;transition:opacity .25s}
.tc:hover::after{opacity:1}
.tc-name{font-family:var(--serif);font-size:15px;font-weight:700;color:var(--t);margin-bottom:7px}
.tc-desc{font-size:12px;color:var(--t2);line-height:1.65;margin-bottom:13px}
.tc-buls{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--b)}
.tcb{font-size:11px;color:var(--t2);line-height:1.55;display:flex;align-items:flex-start;gap:7px}
.tcb::before{content:'--';color:var(--gold);font-family:var(--mono);font-size:10px;flex-shrink:0;margin-top:1px}
.tc-price{font-family:var(--mono);font-size:10px;color:var(--t3);background:rgba(255,255,255,.04);padding:2px 8px;border-radius:3px;border:1px solid var(--b)}
.rs-strip{background:var(--bg2);border:1px solid var(--b);border-radius:4px;padding:22px 28px;margin-bottom:40px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;position:relative;overflow:hidden}
.rs-strip::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,var(--gold),var(--teal))}
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding:44px 20px;overflow-y:auto;backdrop-filter:blur(10px);animation:fadeUp .25s ease}
.modal{width:100%;max-width:660px;background:var(--bg2);border:1px solid var(--b2);border-radius:4px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.7)}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--b);background:var(--bg3)}
.modal-ey{font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:3px}
.modal-title{font-family:var(--serif);font-size:18px;font-weight:700;color:var(--t)}
.mcls{width:28px;height:28px;background:rgba(255,255,255,.05);border:1px solid var(--b);color:var(--t2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;border-radius:3px;transition:all .12s}
.mcls:hover{color:var(--t)}
.mtabs{display:flex;border-bottom:1px solid var(--b);padding:0 22px}
.mtab{padding:10px 14px;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:var(--t3);cursor:pointer;border:none;background:none;border-bottom:1.5px solid transparent;transition:all .12s}
.mtab:hover{color:var(--t2)}
.mtab.on{color:var(--gold);border-bottom-color:var(--gold)}
.mbody{padding:20px 22px}
.mtip{display:flex;align-items:center;gap:7px;padding:8px 12px;background:var(--gd2);border:1px solid rgba(201,168,76,.15);border-radius:3px;font-family:var(--mono);font-size:10px;color:var(--gold);margin-bottom:13px}
.cblock{background:var(--bg);border:1px solid var(--b);border-radius:4px;padding:15px;font-family:var(--mono);font-size:11px;line-height:1.95;color:var(--t2);white-space:pre-wrap;max-height:380px;overflow-y:auto}
.coming-soon{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 54px);text-align:center;padding:40px}
`

const TOOLS = [
  {id:'receptionist',cat:'comm',name:'AI Phone Receptionist',price:'$149–$299/mo',tag:'#1 Seller',tagClass:'tag-gold',desc:'24/7 AI voice agent answers every call, books appointments, handles FAQs. Customers cannot tell it is AI.',bullets:['Answers calls 24/7 with no missed leads','Books into the client\'s existing calendar','Custom voice and business knowledge','Daily summary texts to the owner']},
  {id:'smsbot',cat:'comm',name:'AI SMS Auto-Responder',price:'$79–$149/mo',tag:'Fast Close',tagClass:'tag-teal',desc:'Replies to every inbound text in under 10 seconds. Handles pricing, availability, and bookings automatically.',bullets:['Responds in under 10 seconds, 24 hours a day','Handles pricing, service, and availability','Sends booking confirmations automatically','Works on the client\'s existing number']},
  {id:'missedcall',cat:'comm',name:'Missed Call Text-Back',price:'$49–$99/mo',tag:'Easy Close',tagClass:'tag-gray',desc:'Every missed call triggers an AI text within 60 seconds. Recovers leads before they find a competitor.',bullets:['AI text fires within 60 seconds of missed call','Continues conversation if customer replies','Weekly missed vs recovered report','Works with any existing phone number']},
  {id:'reviews',cat:'mktg',name:'AI Review Manager',price:'$99–$179/mo',tag:'High Demand',tagClass:'tag-gold',desc:'Post-visit review requests plus AI responds to every Google review in 15 minutes. Average: 3.9 to 4.6 stars in 90 days.',bullets:['Auto review request texts after visits','AI responds to every Google review in 15 min','Negative review alerts and triage','Monthly reputation report']},
  {id:'social',cat:'mktg',name:'Social Media Autopilot',price:'$129–$229/mo',tag:'New',tagClass:'tag-teal',desc:'AI generates and schedules 4–5 posts per week. Owner approves by text, 2 minutes a week.',bullets:['4–5 posts/week scheduled at peak times','Sounds like the owner, not a robot','Holiday and local event hooks built in','Owner approves before anything posts']},
  {id:'seo',cat:'mktg',name:'Local SEO Engine',price:'$99–$179/mo',tag:'Long Term',tagClass:'tag-teal',desc:'Monthly AI content that ranks the business higher in local Google searches. All done for them.',bullets:['4 Google Business Profile posts/month','10 Q&A answers seeded monthly','1 locally-optimized blog post/month','Monthly rank vs competitor report']},
  {id:'chatbot',cat:'ops',name:'Website AI Chat Widget',price:'$69–$129/mo',tag:'Easy Upsell',tagClass:'tag-teal',desc:'Smart chat answers questions, quotes prices, captures leads, and books appointments 24/7.',bullets:['Trained on real services and pricing','Captures name, email, phone from every chat','Connects to calendar for instant booking','Escalates complex requests to owner']},
  {id:'reminders',cat:'ops',name:'Smart Appointment Reminders',price:'$59–$99/mo',tag:'No-Brainer',tagClass:'tag-gray',desc:'Automated SMS reminders 24h and 2h before every appointment. Reduces no-shows by 60% on average.',bullets:['Reminders at 24h and 2h before','Two-tap confirm or reschedule','60% fewer no-shows avg in 30 days','Works with any existing booking system']},
  {id:'menusync',cat:'ops',name:'AI Menu and Pricing Sync',price:'$49–$89/mo',tag:'Saves Hours',tagClass:'tag-gray',desc:'Owner texts a change and AI syncs it to website, Google Business, and Instagram in 90 seconds.',bullets:['Update by text or voice note','Auto-syncs website, GBP, and Instagram','Holiday hours handled automatically','Zero tech knowledge required']},
  {id:'loyalty',cat:'rev',name:'Loyalty and Win-Back Engine',price:'$99–$199/mo',tag:'High ROI',tagClass:'tag-gold',desc:'Tracks every customer. Win-back texts at 30, 60, 90 days. Digital loyalty stamp card via SMS.',bullets:['Win-back texts at 30, 60, 90-day marks','Digital punch card via SMS, no app needed','Birthday and anniversary offers automated','22% of lapsed customers return avg']},
  {id:'emailcamp',cat:'rev',name:'AI Email Campaigns',price:'$79–$149/mo',tag:'Recurring',tagClass:'tag-gray',desc:'2 monthly email campaigns, fully AI-written. Owner approves before send.',bullets:['2 campaigns/month, fully AI-written','Owner approves before every send','Holiday and seasonal promo calendar','Open rate and booking attribution']},
  {id:'referral',cat:'rev',name:'AI Referral Program',price:'$79–$149/mo',tag:'Word of Mouth',tagClass:'tag-teal',desc:'After each visit, customers get a unique referral link. When a friend books, both get rewarded automatically.',bullets:['Unique referral link per customer via SMS','Both parties get rewarded automatically','14 new customers in month 1 avg','Monthly revenue attribution report']},
]

const PITCH: Record<string, any> = {
  receptionist:{n:'AI Phone Receptionist',call:'[Owner Name], one question: what happens when a customer calls your shop during a busy hour and nobody picks up?\n\n[PAUSE]\n\nThat caller goes to your nearest competitor. Every single time.\n\nI deploy AI phone receptionists for local businesses. It answers every call naturally, books directly into your calendar, and texts you a daily summary.\n\n$200 per month. I can have a live demo running on your number in under an hour. Want to hear it?',email:'Subject: Your missed calls are going to your competitor\n\nHi [Owner Name],\n\nEvery unanswered call is a booking that goes to the shop down the street.\n\nI deploy AI phone receptionists that answer every call naturally, book appointments, and send daily summaries.\n\n$200 per month. Live demo on your number within the hour.\n\n[Your Name]',sms:'Hi [Name], I build AI phone receptionists for local shops. Answers every call, books appts, $200/mo. Demo in under an hour. Interested? [Your Name]'},
  smsbot:{n:'AI SMS Auto-Responder',call:'[Owner Name], if a customer texts at 10pm asking about prices, what happens right now?\n\n[PAUSE]\n\nNothing until morning. By then they have already booked somewhere else.\n\nI set up AI that replies to every text in under 10 seconds, 24/7. $99 per month. Demo on your number right now?',email:'Subject: A customer just texted your shop. Nobody replied.\n\nHi [Owner Name],\n\nCustomers text constantly outside business hours. When nobody replies within minutes, they move on.\n\nAI SMS that responds in under 10 seconds. $99/month. Demo today.\n\n[Your Name]',sms:'Hi [Name], AI SMS bot for your shop. Responds in 8 sec, books appts 24/7. $99/mo. Demo today? [Your Name]'},
  missedcall:{n:'Missed Call Text-Back',call:'[Owner], how many calls do you miss per week?\n\n[PAUSE]\n\n78% of customers who do not get an answer do not call back.\n\nEvery missed call triggers an AI text within 60 seconds. $79 per month. 30-day trial available.',email:'Subject: 8 missed calls last week. Here is where they went.\n\nMissed call text-back: AI text fires within 60 seconds of every missed call.\n\n$79/month. Setup in under an hour.\n\n[Your Name]',sms:'Hi [Name], every missed call is a lost booking. AI texts back in 60 seconds. $79/mo, 30-day trial. [Your Name]'},
  reviews:{n:'AI Review Manager',call:'[Owner], what is your current Google rating?\n\n[PAUSE]\n\nBusinesses that implement systematic review requests move from 3.9 to 4.6 stars within 90 days on average.\n\nPost-visit review request texts plus AI responding to every review within 15 minutes. $149 per month.',email:'Subject: Your competitors average 4.7 stars.\n\nSystematic review collection plus AI response to every Google review within 15 minutes. Average: 3.9 to 4.6 stars in 90 days.\n\n$149/month.\n\n[Your Name]',sms:'Hi [Name], I automate Google reviews for local shops. 3.9 to 4.6 stars in 90 days avg. $149/mo. Interested? [Your Name]'},
  social:{n:'Social Media Autopilot',call:'[Owner], when did you last post on Instagram?\n\n[PAUSE]\n\nShops posting consistently see 3x more profile discovery. 4 to 5 posts per week, you approve by text, 2 minutes a week.\n\n$149 per month. Free sample week?',email:'Subject: Your Instagram has not posted in [X] weeks.\n\nShops posting 4-5 times per week see 3x more discovery. Fully managed. 2 minutes a week.\n\n$149/month. Free sample week.\n\n[Your Name]',sms:'Hi [Name], fully managed social media. 4-5 posts/week, approve by text, $149/mo. Free sample week? [Your Name]'},
  seo:{n:'Local SEO Engine',call:'[Owner], where does your listing appear when someone searches for your business type nearby?\n\n[PAUSE]\n\nTop 3 results get 80% of all clicks. Monthly content to your Google profile. Most clients move up 3-5 positions in 60 days.\n\n$149 per month. Free audit?',email:'Subject: Where do you rank on Google for your area?\n\nTop 3 Google positions capture 80% of local clicks. Monthly content. Most clients up 3-5 spots in 60 days.\n\n$149/month. Free ranking audit.\n\n[Your Name]',sms:'Hi [Name], I help local shops rank in Google top 3. Most clients up 3-5 spots in 60 days. $149/mo. Free audit? [Your Name]'},
  chatbot:{n:'Website AI Chat Widget',call:'Now that the site is live, visitors arrive at night when you are unavailable. An AI chat widget answers questions, quotes prices, and books appointments 24/7.\n\nNatural add-on at launch. $69 per month. Shall I include it?',email:'Subject: One addition that books while you sleep.\n\nAI chat trained on services, pricing, and hours. Books appointments 24/7.\n\n$69/month.\n\n[Your Name]',sms:'Hi [Name], chat widget on your site, books appts 24/7. $69/mo. Add it? [Your Name]'},
  reminders:{n:'Smart Appointment Reminders',call:'[Owner], how many no-shows do you get per week?\n\n[PAUSE]\n\nAutomated SMS reminders at 24h and 2h before each appointment. 60% fewer no-shows in month one.\n\n$79 per month.',email:'Subject: No-shows are costing you more than you realize.\n\n5 no-shows/week at $30 each is $600/month gone. Automated reminders, one-tap confirm. 60% fewer no-shows avg.\n\n$79/month.\n\n[Your Name]',sms:'Hi [Name], automated appt reminders cut no-shows 60%. One-tap confirm. $79/mo. Try it? [Your Name]'},
  menusync:{n:'AI Menu and Pricing Sync',call:'If you wanted to update your hours right now, how would you do it?\n\n[PAUSE]\n\nText the change. AI syncs website, Google, and Instagram in 90 seconds. No logins.\n\n$69 per month.',email:'Subject: Your prices on Google do not match your website.\n\nText any change. AI syncs everything in 90 seconds.\n\n$69/month.\n\n[Your Name]',sms:'Hi [Name], text updates, AI syncs website, Google, Instagram in 90 sec. $69/mo. Interested? [Your Name]'},
  loyalty:{n:'Loyalty and Win-Back Engine',call:'Do you have any way to reach customers who have not been back in a while?\n\n[PAUSE]\n\nThose people already like you. Automated texts at 30, 60, and 90 days. 22% return in month one avg.\n\n$149 per month.',email:'Subject: You have 200 customers you have not talked to in months.\n\nAutomated win-back texts. Digital loyalty card via SMS. 22% return avg in 30 days.\n\n$149/month.\n\n[Your Name]',sms:'Hi [Name], AI win-back texts for lapsed customers. 22% return in 30 days avg. $149/mo. [Your Name]'},
  emailcamp:{n:'AI Email Campaigns',call:'Do you have a customer email list?\n\n[PAUSE]\n\n2 campaigns per month, fully AI-written, you approve before send. One promo to 300 people equals 15-25 bookings.\n\n$99 per month.',email:'Subject: Your email list is money you are not collecting.\n\n2 AI-crafted campaigns per month. You review before send. $99/month.\n\n[Your Name]',sms:'Hi [Name], 2 AI email campaigns per month. One promo = 15-25 bookings. $99/mo, first draft free. [Your Name]'},
  referral:{n:'AI Referral Program',call:'What percentage of new customers come from word of mouth?\n\n[PAUSE]\n\nThat is your best channel and it is completely unmanaged. After every visit, customers get a referral link. One shop got 14 new customers in month one.\n\n$99 per month.',email:'Subject: Your best customers could be sending you new ones automatically.\n\nAutomated referral program. Friend books via link, both rewarded. 14 new customers in month 1 for one client.\n\n$99/month.\n\n[Your Name]',sms:'Hi [Name], automated referral program. Friend books via link, both get rewarded. 14 new customers month 1 avg. $99/mo. [Your Name]'},
}

function ini(n: string) { const p = n.split(' '); return p.length >= 2 ? p[0][0] + p[1][0] : n.slice(0, 2) }
function scoreColor(s: number) { return s >= 80 ? '#c9a84c' : s >= 60 ? '#2dd4bf' : '#8a93a8' }

export default function DashboardClient({ user, subscription }: any) {
  const [tab, setTab] = useState('leads')
  const [location, setLocation] = useState('Miami, FL')
  const [category, setCategory] = useState('barbershop')
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toolCat, setToolCat] = useState('all')
  const [pitchModal, setPitchModal] = useState<{tool: string, tab: string} | null>(null)
  const [briefModal, setBriefModal] = useState<string | null>(null)
  const [pitchTab, setPitchTab] = useState('call')

  const plan = subscription?.plans?.name || 'Starter'
  const used = subscription?.searches_used || 0
  const limit = subscription?.plans?.searches_limit ?? 2
  const isEnt = subscription?.plan_id === 'enterprise'
  const remaining = isEnt ? 'Unlimited' : `${limit - used} remaining`

  async function runScan() {
    if (!location || !category) return
    setLoading(true); setError(''); setLeads([])
    const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location, category }) })
    const data = await res.json()
    if (res.status === 403) setError('Search limit reached. Upgrade to continue.')
    else if (data.leads) setLeads(data.leads)
    setLoading(false)
  }

  const filteredTools = toolCat === 'all' ? TOOLS : TOOLS.filter(t => t.cat === toolCat)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--t)' }}>
      <style>{STYLE}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" style={{ fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 700, color: 'var(--t)', textDecoration: 'none', letterSpacing: '-.02em', marginRight: '16px' }}>
          LeadHunter <span style={{ color: 'var(--gold)' }}>Pro</span>
        </a>
        <button className={`ntab${tab==='leads'?' on':''}`} onClick={() => setTab('leads')}>Lead Hunter</button>
        <button className={`ntab${tab==='tools'?' on':''}`} onClick={() => setTab('tools')}>AI Tools<span className="ntab-badge">12</span></button>
        <button className="ntab" onClick={() => setTab('re')} style={{ opacity: .6 }}>Real Estate<span className="ntab-lock">SOON</span></button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center', padding: '0 20px' }}>
          <span style={{ padding: '4px 12px', background: 'var(--gd)', border: '1px solid rgba(201,168,76,.2)', borderRadius: '3px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--gold)' }}>
            {plan} &middot; {remaining}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--t2)', fontFamily: 'var(--mono)' }}>{user.email}</span>
          <a href="/" className="btn" style={{ fontSize: '11px', padding: '5px 10px' }}>Home</a>
        </div>
      </nav>

      {/* LEAD HUNTER TAB */}
      {tab === 'leads' && (
        <div className="scr on">
          {leads.length === 0 ? (
            <div className="sl">
              <div className="sp">
                <div className="sp-ey"><span className="ldot" style={{ marginRight: '4px' }}></span><span style={{ color: 'var(--gold)', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase' }}>No-Website Lead Finder</span></div>
                <div><div className="sp-title">Identify businesses <em>without a web presence.</em></div><p className="sp-desc" style={{ marginTop: '7px' }}>Enter any location and business category. Cross-references Google Places against domain registries and returns leads ranked by no-website confidence score.</p></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div><div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '6px' }}>Location</div><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Miami, FL" onKeyDown={e => e.key==='Enter'&&runScan()} /></div>
                    <div><div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '6px' }}>Business Category</div><input value={category} onChange={e => setCategory(e.target.value)} placeholder="barbershop" onKeyDown={e => e.key==='Enter'&&runScan()} /></div>
                  </div>
                  {error && <p style={{ color: 'var(--red)', fontSize: '12px', padding: '8px 12px', background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.18)', borderRadius: '4px' }}>{error}</p>}
                  <button className="run-btn" disabled={loading} onClick={runScan} style={{ background: 'var(--gold)', color: '#0a0b0d', boxShadow: '0 4px 20px rgba(201,168,76,.2)' }}>
                    {loading ? <><span className="spinner"></span> Scanning...</> : 'Run Lead Scan'}
                  </button>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '5px' }}>Quick-load examples</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {[['Miami Beach FL','hair salon'],['Austin TX','auto repair'],['Brooklyn NY','restaurant'],['Chicago IL','dentist']].map(([loc,cat]) => (
                      <button key={loc} className="chip" onClick={() => { setLocation(loc); setCategory(cat) }}>{cat}, {loc.split(' ')[0]}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sv">
                <div className="vg">
                  <div className="vc"><div className="vn" style={{ color: 'var(--gold)' }}>38%</div><div className="vd">of US small businesses have no real website</div></div>
                  <div className="vc"><div className="vn" style={{ color: 'var(--gold)' }}>$1.2K</div><div className="vd">average website sale per closed lead</div></div>
                  <div className="vc"><div className="vn" style={{ color: 'var(--gold)' }}>60s</div><div className="vd">to generate a complete brief and pitch</div></div>
                  <div className="vc"><div className="vn" style={{ color: 'var(--gold)' }}>$6.7K</div><div className="vd">year-one value: site plus three AI tools</div></div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="rtbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div className="rpill"><span className="rdot" style={{ background: 'var(--gold)' }}></span>{leads.length} leads found</div>
                  <div className="rpill">{location}</div>
                  <div className="rpill">{category}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-gold" onClick={() => setLeads([])}>New Search</button>
                </div>
              </div>
              <div className="rbody">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '18px' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--t)' }}>{leads.length} Leads</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>sorted by confidence score</div>
                </div>
                <div className="lgrid">
                  {leads.map((lead, i) => {
                    const sc = scoreColor(lead.score)
                    return (
                      <div key={i} className="lcard">
                        <div className="lcard-bar" style={{ background: `linear-gradient(90deg,${sc},${sc}88)` }}></div>
                        <div className="lctop">
                          <div className="lc-ini">{ini(lead.place.name || '')}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="lc-name">{lead.place.name}</div>
                            <div className="lc-cat">{category} &middot; {location.split(',')[0]}</div>
                          </div>
                          {lead.place.rating && <div className="lc-stars">{lead.place.rating}★ ({lead.place.user_ratings_total})</div>}
                        </div>
                        <div>
                          <div className="sc-row">
                            <div className="sc-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div className="sc-ring" style={{ borderColor: sc, color: sc }}>{lead.score}</div>
                              <span style={{ color: sc, fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.05em' }}>{lead.confidence}</span>
                            </div>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)' }}>no-website confidence</span>
                          </div>
                          <div className="sc-track"><div className="sc-fill" style={{ width: `${lead.score}%`, background: `linear-gradient(90deg,${sc},${sc}88)` }}></div></div>
                        </div>
                        {lead.reasons.length > 0 && (
                          <div className="reasons">{lead.reasons.map((r: string, j: number) => (
                            <div key={j} className="rsn"><span style={{ color: sc, fontFamily: 'var(--mono)', fontSize: '10px', flexShrink: 0 }}>--</span>{r}</div>
                          ))}</div>
                        )}
                        <div className="divline"></div>
                        <div className="cts">
                          <div className="ci"><span style={{ color: 'var(--t3)', width: '14px', flexShrink: 0, fontSize: '11px' }}>@</span><span className="cv">{lead.place.formatted_address}</span></div>
                          {lead.place.formatted_phone_number && <div className="ci"><span style={{ color: 'var(--t3)', width: '14px', flexShrink: 0, fontSize: '11px' }}>T</span><span className="cv lk">{lead.place.formatted_phone_number}</span></div>}
                          {lead.place.website && <div className="ci"><span style={{ color: 'var(--t3)', width: '14px', flexShrink: 0, fontSize: '11px' }}>W</span><a href={lead.place.website} target="_blank" rel="noopener" className="cv lk" style={{ textDecoration: 'none' }}>{lead.place.website}</a></div>}
                        </div>
                        <div className="divline"></div>
                        <div className="card-acts">
                          <button className="ca-btn ca-pri" onClick={() => setBriefModal(lead.place.name)}>Developer Brief</button>
                          <button className="ca-btn ca-sec" onClick={() => { setPitchModal({ tool: 'receptionist', tab: 'call' }); setPitchTab('call') }}>Pitch Script</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI TOOLS TAB */}
      {tab === 'tools' && (
        <div className="scr on">
          <div className="tools-wrap">
            <div style={{ marginBottom: '44px', maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
                <span style={{ width: '24px', height: '1px', background: 'var(--gold)', display: 'inline-block' }}></span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>12 tools &middot; Full build guides included</span>
              </div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, letterSpacing: '-.025em', color: 'var(--t)', marginBottom: '12px', lineHeight: 1.1 }}>
                The AI toolkit every small business needs.<br /><span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Build. Sell. Collect every month.</span>
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: 1.78, marginBottom: '28px' }}>You closed their website. Now sell the tools that keep their customers engaged and keep you earning recurring monthly revenue. Each tool includes a pitch script to sell it.</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[['all','All Tools'],['comm','Communication'],['mktg','Marketing'],['ops','Operations'],['rev','Revenue']].map(([c,l]) => (
                  <button key={c} onClick={() => setToolCat(c)} style={{ padding: '5px 14px', borderRadius: '3px', fontSize: '12px', fontWeight: 500, border: `1px solid ${toolCat===c?'rgba(201,168,76,.25)':'rgba(255,255,255,.07)'}`, background: toolCat===c?'rgba(201,168,76,.1)':'transparent', color: toolCat===c?'var(--gold)':'var(--t2)', cursor: 'pointer', fontFamily: 'var(--mono)', transition: 'all .12s' }}>{l}</button>
                ))}
              </div>
            </div>

            <div className="rs-strip">
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '5px' }}>Revenue projection per client</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--t)', lineHeight: 1.35 }}>Website + 3 tools = $6,700+ in year one</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[['$1K','Website\none-time','var(--green)'],['$475/mo','3 tools\nrecurring','var(--gold)'],['$6.7K','Year one\nper client','var(--gold)']].map(([n,l,c],i) => (
                  <div key={i} style={{ padding: '12px 16px', background: i===2?'var(--gd)':'var(--bg3)', border: `1px solid ${i===2?'rgba(201,168,76,.2)':'rgba(255,255,255,.07)'}`, borderRadius: '4px', textAlign: 'center', minWidth: '88px' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, lineHeight: 1, color: `${c}` }}>{n}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--t3)', marginTop: '3px', lineHeight: 1.4, whiteSpace: 'pre' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tgrid">
              {filteredTools.map(t => (
                <div key={t.id} className="tc">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '13px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '4px', background: 'var(--bg3)', border: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px' }}>&#9872;</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span className={`tag ${t.tagClass}`}>{t.tag}</span>
                      <span className="tc-price">{t.price}</span>
                    </div>
                  </div>
                  <div className="tc-name">{t.name}</div>
                  <div className="tc-desc">{t.desc}</div>
                  <div className="tc-buls">{t.bullets.map((b,i) => <div key={i} className="tcb">{b}</div>)}</div>
                  <button className="btn btn-gold" style={{ justifyContent: 'center', marginTop: 'auto' }} onClick={() => { setPitchModal({ tool: t.id, tab: 'call' }); setPitchTab('call') }}>
                    Get Pitch Script
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REAL ESTATE - COMING SOON */}
      {tab === 're' && (
        <div className="scr on">
          <div className="coming-soon">
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(96,165,250,.1)', border: '1px solid rgba(96,165,250,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>&#8962;</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 700, color: 'var(--t)', marginBottom: '12px', letterSpacing: '-.02em' }}>Real Estate Intelligence</div>
            <p style={{ fontSize: '14px', color: 'var(--t2)', maxWidth: '440px', lineHeight: 1.75, marginBottom: '28px' }}>Behavioral intent signals from Zillow, Realtor.com, Redfin, and Homes.com. Identify active buyers before they contact any agent. <strong style={{ color: 'var(--t)' }}>Coming soon.</strong></p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
              {['Zillow intent signals','Realtor.com data','Redfin integration','AI outreach scripts'].map(f => (
                <span key={f} style={{ padding: '5px 12px', background: 'rgba(96,165,250,.07)', border: '1px solid rgba(96,165,250,.15)', borderRadius: '3px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--blue)' }}>{f}</span>
              ))}
            </div>
            <button className="btn" style={{ borderColor: 'rgba(96,165,250,.25)', color: 'var(--blue)', background: 'rgba(96,165,250,.07)' }} onClick={() => setTab('leads')}>
              Back to Lead Hunter
            </button>
          </div>
        </div>
      )}

      {/* PITCH MODAL */}
      {pitchModal && (
        <div className="modal-ov" onClick={() => setPitchModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div><div className="modal-ey">Sales Pitch Script</div><div className="modal-title">{PITCH[pitchModal.tool]?.n}</div></div>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                <button className="btn btn-gold btn-sm" style={{ padding: '5px 12px', fontSize: '11px' }} onClick={() => navigator.clipboard.writeText(PITCH[pitchModal.tool]?.[pitchTab] || '')}>Copy</button>
                <button className="mcls" onClick={() => setPitchModal(null)}>&#215;</button>
              </div>
            </div>
            <div className="mtabs">
              {(['call','email','sms'] as const).map(t => <button key={t} className={`mtab${pitchTab===t?' on':''}`} onClick={() => setPitchTab(t)}>{t === 'call' ? 'Call Script' : t === 'email' ? 'Cold Email' : 'SMS'}</button>)}
            </div>
            <div className="mbody">
              <div className="mtip">Replace all bracketed placeholders before use.</div>
              <div className="cblock" style={{ whiteSpace: 'pre-wrap' }}>{PITCH[pitchModal.tool]?.[pitchTab]}</div>
            </div>
          </div>
        </div>
      )}

      {/* BRIEF MODAL */}
      {briefModal && (
        <div className="modal-ov" onClick={() => setBriefModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div><div className="modal-ey">Lovable.dev Developer Brief</div><div className="modal-title">{briefModal}</div></div>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                <button className="btn btn-gold" style={{ padding: '5px 12px', fontSize: '11px' }} onClick={() => {
                  const txt = `# Developer Brief: ${briefModal}\n\n## Project Objective\n${briefModal} is a highly-rated local business without a functional web presence. The site should help new customers find the business, verify services and hours, and build confidence before their first visit.\n\n## Pages Required\n1. Home - Hero, brand statement, photo gallery, services preview, top reviews\n2. Services and Pricing - Full menu with prices\n3. About - Owner story, neighborhood connection\n4. Contact - Maps embed, click-to-call, hours, booking form\n\n## Technical Requirements\n- Mobile-first responsive\n- Click-to-call on all pages\n- Schema.org LocalBusiness JSON-LD\n- SSL, sub-2s load time, Google Analytics 4\n\n## Design Direction\nWarm and professional. Neighborhood character. Photography-forward.\n\n## Scope\n4-page site. 5-7 business days. $800-$1,500 flat.`
                  navigator.clipboard.writeText(txt)
                }}>Copy</button>
                <button className="mcls" onClick={() => setBriefModal(null)}>&#215;</button>
              </div>
            </div>
            <div className="mbody">
              <div className="mtip">Paste directly into Lovable.dev as your project brief.</div>
              <div className="cblock">{`# Developer Brief: ${briefModal}\n\n## Objective\n${briefModal} needs a mobile-first website to help customers find them, verify services, and book appointments.\n\n## Pages\n1. Home — hero, services preview, reviews, CTA\n2. Services & Pricing — full menu\n3. About — owner story, neighborhood roots\n4. Contact — Maps embed, click-to-call, hours, booking form\n\n## Must-Have Features\n- Click-to-call prominent on mobile\n- Google Maps embed\n- Top Google review quotes\n- Photo gallery (owner supplies images)\n\n## Tech\nMobile-first, SSL, Schema markup, load under 2s\n\n## Scope\n4-page site. ~1 week. Quote: $800–$1,500 flat.`}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
