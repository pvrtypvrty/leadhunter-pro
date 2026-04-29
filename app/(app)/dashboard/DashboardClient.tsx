'use client'
import { useState } from 'react'

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const CATS = {
  'Health & Beauty': ['Barbershop','Hair Salon','Nail Salon','Spa & Massage','Tattoo Studio','Eyebrow Threading','Waxing Studio','Tanning Salon','Lash Studio','Med Spa'],
  'Food & Drink': ['Restaurant','Pizza Place','Taco Shop','Bakery','Coffee Shop','Food Truck','Juice Bar','BBQ Restaurant','Sushi Restaurant','Sandwich Shop'],
  'Auto': ['Auto Repair','Car Wash','Auto Detailing','Tire Shop','Oil Change','Towing Service','Auto Glass','Brake Service','Auto Body Shop','Mobile Mechanic'],
  'Home Services': ['Plumber','Electrician','Landscaping','House Cleaning','Pest Control','HVAC','Roofing','Painting','Pool Service','Handyman'],
  'Health & Wellness': ['Dentist','Chiropractor','Optometrist','Physical Therapy','Acupuncture','Mental Health','Veterinarian','Urgent Care','Med Clinic','Pharmacy'],
  'Fitness': ['Gym','Personal Trainer','Yoga Studio','Martial Arts','CrossFit','Dance Studio','Pilates Studio','Boxing Gym','Swim School','Rock Climbing'],
  'Retail': ['Clothing Boutique','Shoe Store','Jewelry Store','Vintage Shop','Smoke Shop','Liquor Store','Pet Store','Toy Store','Gift Shop','Bookstore'],
  'Professional': ['Law Firm','Accounting','Real Estate Agency','Insurance Agent','Mortgage Broker','Financial Advisor','Tax Service','Notary','Photography','Tutoring'],
  'Events & Fun': ['Event Venue','Party Rental','DJ Service','Catering','Photo Booth','Escape Room','Bowling Alley','Mini Golf','Go Kart','Trampoline Park'],
  'Specialty': ['Locksmith','Moving Company','Storage Unit','Print Shop','Alterations','Dry Cleaning','Watch Repair','Electronics Repair','Florist','Trophy Shop'],
}

const TOOLS = [
  {id:'receptionist',cat:'comm',name:'AI Phone Receptionist',price:'$149–$299/mo',tag:'#1 Seller',tagC:'gold',desc:'24/7 AI voice agent answers every call, books appointments, handles FAQs.',
    bullets:['Answers calls 24/7 with no missed leads','Books into existing calendar','Custom voice and business knowledge','Daily summary texts to owner'],
    build:['Sign up for Bland.ai or Vapi.ai (AI phone platform)','Create a new agent and paste in the system prompt below','Connect to client\'s Google Calendar via Zapier','Forward client\'s phone to the AI number','Test with 5 calls before going live'],
    buildPrompt:'You are [Business Name]\'s friendly phone receptionist. Your job is to answer calls, answer questions about services and pricing, and book appointments.\n\nBusiness: [Name]\nServices: [List]\nPricing: [List]\nHours: [Hours]\nAddress: [Address]\n\nWhen booking: collect name, phone, service, preferred time. Confirm by reading back details. Say "I\'ll send you a confirmation text shortly."',
    pitch:{call:'[Owner], what happens when a customer calls during a busy hour and nobody picks up?\n\n[PAUSE]\n\nThat caller goes to your competitor. Every time.\n\nI deploy AI phone receptionists. Answers every call naturally, books into your calendar, texts you a daily summary. $200/month. Demo on your number in under an hour. Want to hear it?',email:'Subject: Your missed calls are going to your competitor\n\nEvery unanswered call is a booking lost to the shop down the street.\n\nI deploy AI phone receptionists — answers every call, books appointments, sends daily summaries.\n\n$200/month. Live demo on your number within the hour.\n\n[Your Name]',sms:'Hi [Name], I build AI phone receptionists for local shops. Answers every call, books appts, $200/mo. Demo in under an hour? [Your Name]'}},
  {id:'smsbot',cat:'comm',name:'AI SMS Auto-Responder',price:'$79–$149/mo',tag:'Fast Close',tagC:'teal',desc:'Replies to every inbound text in under 10 seconds, 24/7.',
    bullets:['Responds in under 10 seconds','Handles pricing, availability, booking','Sends booking confirmations','Works on existing number'],
    build:['Sign up for Twilio + OpenAI or use GoHighLevel','Set up a webhook to catch incoming SMS','Pass message to Claude/GPT with business context prompt','Send response back via Twilio SMS API','Set up forwarding so client keeps their number'],
    buildPrompt:'You are a friendly SMS assistant for [Business Name]. Reply to customer texts about services, pricing, and availability. Keep replies under 160 characters when possible.\n\nServices: [List]\nPricing: [List]\nHours: [Hours]\nBooking link: [Link]\n\nAlways end with an offer to book or call.',
    pitch:{call:'[Owner], if a customer texts at 10pm asking about prices, what happens?\n\n[PAUSE]\n\nNothing until morning. By then they booked somewhere else.\n\nAI that replies in under 10 seconds, 24/7. $99/month. Demo on your number today?',email:'Subject: A customer just texted. Nobody replied.\n\nCustomers text constantly outside business hours. When nobody replies in minutes, they move on.\n\nAI SMS: responds in under 10 seconds. $99/month.\n\n[Your Name]',sms:'Hi [Name], AI SMS bot for your shop. Responds in 8 sec, books 24/7. $99/mo. Demo today? [Your Name]'}},
  {id:'missedcall',cat:'comm',name:'Missed Call Text-Back',price:'$49–$99/mo',tag:'Easy Close',tagC:'gray',desc:'Every missed call triggers an AI text within 60 seconds.',
    bullets:['AI text fires within 60 sec of missed call','Continues conversation if customer replies','Weekly missed vs recovered report','Works with any phone number'],
    build:['Use GoHighLevel or build with Twilio + Zapier','Connect to client\'s phone via call forwarding or GHL','When call missed: trigger webhook → send SMS via Twilio','Use Claude to personalize follow-up based on business type','Set up weekly email report of missed vs recovered'],
    buildPrompt:'A potential customer just called [Business Name] and didn\'t reach anyone. Send a warm, brief text:\n\n"Hi! Sorry we missed your call at [Business Name]. We\'d love to help — what can we do for you? Reply here or call us back at [Phone]. We\'re open [Hours]."',
    pitch:{call:'[Owner], how many calls do you miss per week?\n\n[PAUSE]\n\n78% of customers who don\'t get an answer don\'t call back.\n\nEvery missed call triggers an AI text in 60 seconds. $79/month.',email:'Subject: 8 missed calls last week — here\'s where they went.\n\nMissed call text-back: AI text fires within 60 seconds of every missed call.\n\n$79/month. Setup in under an hour.\n\n[Your Name]',sms:'Hi [Name], every missed call is a lost booking. AI texts back in 60 sec. $79/mo, 30-day trial. [Your Name]'}},
  {id:'reviews',cat:'mktg',name:'AI Review Manager',price:'$99–$179/mo',tag:'High Demand',tagC:'gold',desc:'Post-visit review requests + AI responds to every Google review in 15 minutes.',
    bullets:['Auto review request texts after visits','AI responds to every review in 15 min','Negative review alerts and triage','Monthly reputation report'],
    build:['Connect to client\'s Google Business Profile via API','Set up post-visit trigger (POS, booking system, or manual CSV)','Send review request SMS 2-4 hours after visit via Twilio','Use Claude to draft personalized response for each new review','Alert owner via text for any review under 3 stars'],
    buildPrompt:'Write a warm, brief Google review response for [Business Name]. The review says: "[REVIEW TEXT]" Rating: [STARS]/5.\n\nRules: Under 50 words. Thank them by first name if given. Address the specific thing they mentioned. End with an invitation to return. Sound human, not corporate.',
    pitch:{call:'[Owner], what\'s your current Google rating?\n\n[PAUSE]\n\nBusinesses that implement systematic review requests move from 3.9 to 4.6 stars in 90 days average.\n\nPost-visit review requests + AI responding to every review in 15 minutes. $149/month.',email:'Subject: Your competitors average 4.7 stars.\n\nSystematic review collection + AI response to every Google review within 15 minutes. Average: 3.9 to 4.6 stars in 90 days.\n\n$149/month.\n\n[Your Name]',sms:'Hi [Name], I automate Google reviews for local shops. 3.9 to 4.6 stars in 90 days avg. $149/mo? [Your Name]'}},
  {id:'social',cat:'mktg',name:'Social Media Autopilot',price:'$129–$229/mo',tag:'New',tagC:'teal',desc:'AI generates and schedules 4–5 posts per week. Owner approves by text.',
    bullets:['4–5 posts/week at peak times','Sounds like the owner, not a robot','Holiday and local event hooks','Owner approves before anything posts'],
    build:['Use Buffer or Hootsuite API for scheduling','Set up monthly content calendar template in Airtable','Use Claude to generate 20 posts/month based on business type','Send approval texts with image + caption via Twilio MMS','Auto-schedule approved posts to Instagram, Facebook, Google Business'],
    buildPrompt:'Create 5 social media posts for [Business Name], a [category] in [city]. Tone: friendly, local, authentic. Each post: 1-2 sentences + 3-5 relevant hashtags. Mix: 2 service highlights, 1 before/after or result, 1 community/local angle, 1 call to action. Avoid generic corporate language.',
    pitch:{call:'[Owner], when did you last post on Instagram?\n\n[PAUSE]\n\nShops posting consistently see 3x more profile discovery. 4–5 posts/week, you approve by text, 2 minutes a week.\n\n$149/month. Free sample week?',email:'Subject: Your Instagram hasn\'t posted in [X] weeks.\n\nShops posting 4-5x/week see 3x more discovery. Fully managed. 2 minutes a week.\n\n$149/month. Free sample week.\n\n[Your Name]',sms:'Hi [Name], fully managed social. 4-5 posts/week, approve by text, $149/mo. Free sample week? [Your Name]'}},
  {id:'seo',cat:'mktg',name:'Local SEO Engine',price:'$99–$179/mo',tag:'Long Term',tagC:'teal',desc:'Monthly AI content that ranks the business higher in local Google searches.',
    bullets:['4 Google Business Profile posts/month','10 Q&A answers seeded monthly','1 locally-optimized blog post/month','Monthly rank vs competitor report'],
    build:['Claim/verify client Google Business Profile','Use Claude to generate 4 GBP posts monthly (services, promos, events)','Use Claude to write and add 10 Q&A pairs to GBP','Publish 1 locally-optimized blog post to their WordPress/Wix site','Track rank changes monthly using BrightLocal or Google Search Console'],
    buildPrompt:'Write a Google Business Profile post for [Business Name], a [category] in [city/neighborhood]. Goal: rank for "[keyword]". Under 150 words. Include the city name naturally. End with a clear CTA. Include 1-2 relevant hashtags.',
    pitch:{call:'[Owner], where do you appear when someone searches "[category] near me"?\n\n[PAUSE]\n\nTop 3 results get 80% of all clicks. Monthly content to your Google profile. Most clients up 3-5 positions in 60 days.\n\n$149/month. Free audit?',email:'Subject: Where do you rank on Google?\n\nTop 3 Google positions = 80% of local clicks. Monthly content. Most clients up 3-5 spots in 60 days.\n\n$149/month. Free ranking audit.\n\n[Your Name]',sms:'Hi [Name], I help local shops rank in Google top 3. Most clients up 3-5 spots in 60 days. $149/mo. Free audit? [Your Name]'}},
  {id:'chatbot',cat:'ops',name:'Website AI Chat Widget',price:'$69–$129/mo',tag:'Easy Upsell',tagC:'teal',desc:'Smart chat answers questions, captures leads, and books appointments 24/7.',
    bullets:['Trained on real services and pricing','Captures name, email, phone from every chat','Connects to calendar for instant booking','Escalates complex requests to owner'],
    build:['Sign up for Tidio, Crisp, or build with Claude API + widget','Embed JavaScript snippet into client\'s website','Train on business services, pricing, hours, FAQs','Connect booking CTA to Calendly or existing booking system','Set up email/SMS alert when lead captured'],
    buildPrompt:'You are a helpful chat assistant for [Business Name], a [category] at [address]. Hours: [Hours]. Services: [List with prices].\n\nYour goal: answer questions helpfully, and when appropriate, offer to book an appointment or collect their contact info. Always be warm and brief. If you can\'t answer, say "Let me have someone from the team follow up — what\'s your name and phone number?"',
    pitch:{call:'Now that the site is live, visitors arrive at night when you\'re unavailable. A chat widget answers questions and books appointments 24/7.\n\nNatural add-on at launch. $69/month. Include it?',email:'Subject: One addition that books while you sleep.\n\nAI chat trained on services, pricing, and hours. Books appointments 24/7.\n\n$69/month.\n\n[Your Name]',sms:'Hi [Name], chat widget on your site, books appts 24/7. $69/mo. Add it? [Your Name]'}},
  {id:'reminders',cat:'ops',name:'Smart Appointment Reminders',price:'$59–$99/mo',tag:'No-Brainer',tagC:'gray',desc:'Automated SMS reminders 24h and 2h before. Reduces no-shows by 60%.',
    bullets:['Reminders at 24h and 2h before appointment','Two-tap confirm or reschedule','60% fewer no-shows avg in 30 days','Works with any booking system'],
    build:['Connect to client\'s booking system via API or Zapier','Pull appointments 24h and 2h in advance','Send personalized SMS via Twilio with confirm/reschedule link','If no response 2h before: call client to notify','Send weekly no-show vs confirmed report via email'],
    buildPrompt:'Send an appointment reminder SMS for [Business Name]:\n\n"Hi [Customer Name]! This is a reminder about your [service] appointment at [Business Name] tomorrow at [Time]. Reply YES to confirm or RESCHEDULE to change. See you then! [Business Name] — [Phone]"',
    pitch:{call:'[Owner], how many no-shows do you get per week?\n\n[PAUSE]\n\nAutomated SMS reminders at 24h and 2h before each appointment. 60% fewer no-shows in month one.\n\n$79/month.',email:'Subject: No-shows are costing you more than you realize.\n\n5 no-shows/week at $30 each = $600/month gone. Automated reminders, one-tap confirm. 60% fewer no-shows avg.\n\n$79/month.\n\n[Your Name]',sms:'Hi [Name], automated appt reminders cut no-shows 60%. One-tap confirm. $79/mo. Try it? [Your Name]'}},
  {id:'menusync',cat:'ops',name:'AI Menu and Pricing Sync',price:'$49–$89/mo',tag:'Saves Hours',tagC:'gray',desc:'Text a change and AI syncs it to website, Google, and Instagram in 90 seconds.',
    bullets:['Update by text or voice note','Syncs website, GBP, and Instagram','Holiday hours automated','Zero tech knowledge required'],
    build:['Set up Twilio number for client to text updates','Use Claude to interpret the update (price change, new service, hours)','Connect to website CMS via API (WordPress REST, Wix API, etc.)','Update Google Business Profile via GBP API','Post update to Instagram via Meta Graph API'],
    buildPrompt:'A business owner sent this update: "[UPDATE TEXT]"\n\nExtract and format as JSON: { type: "price_change|new_service|hours_update|menu_item|special_offer", item: "", old_value: "", new_value: "", effective_date: "" }\n\nThen write a brief Instagram caption announcing this change.',
    pitch:{call:'If you wanted to update your hours right now, how would you do it?\n\n[PAUSE]\n\nText the change. AI syncs website, Google, and Instagram in 90 seconds. No logins.\n\n$69/month.',email:'Subject: Your prices on Google don\'t match your website.\n\nText any change. AI syncs everything in 90 seconds.\n\n$69/month.\n\n[Your Name]',sms:'Hi [Name], text updates, AI syncs website + Google + Instagram in 90 sec. $69/mo? [Your Name]'}},
  {id:'loyalty',cat:'rev',name:'Loyalty and Win-Back Engine',price:'$99–$199/mo',tag:'High ROI',tagC:'gold',desc:'Tracks every customer. Win-back texts at 30/60/90 days. Digital punch card via SMS.',
    bullets:['Win-back texts at 30, 60, 90-day marks','Digital punch card via SMS, no app needed','Birthday and anniversary offers automated','22% of lapsed customers return avg'],
    build:['Build customer tracking table in Airtable or Supabase','Import customer list from POS or collect at checkout via SMS opt-in','Set up automated sequences in Zapier: 30/60/90 day triggers','Use Claude to personalize win-back messages based on last service','Send birthday messages 1 week before birthday date'],
    buildPrompt:'Write a win-back SMS for [Business Name]. The customer last visited [X] days ago. Their last service was [service]. Keep it under 160 characters, warm, and include a specific offer.\n\nExample: "Hi [Name]! It\'s been a while at [Shop]. We miss you — here\'s 15% off your next [service]. Book at [Link] or call [Phone]. Valid this week only."',
    pitch:{call:'Do you have any way to reach customers who haven\'t been back in a while?\n\n[PAUSE]\n\nThose people already like you. Automated texts at 30, 60, and 90 days. 22% return in month one avg.\n\n$149/month.',email:'Subject: You have 200 customers you haven\'t talked to in months.\n\nAutomated win-back texts. Digital loyalty card via SMS. 22% return avg in 30 days.\n\n$149/month.\n\n[Your Name]',sms:'Hi [Name], AI win-back texts for lapsed customers. 22% return in 30 days avg. $149/mo. [Your Name]'}},
  {id:'emailcamp',cat:'rev',name:'AI Email Campaigns',price:'$79–$149/mo',tag:'Recurring',tagC:'gray',desc:'2 monthly email campaigns, fully AI-written. Owner approves before send.',
    bullets:['2 campaigns/month, fully AI-written','Owner approves before every send','Holiday and seasonal promo calendar','Open rate and booking attribution'],
    build:['Connect Mailchimp or Klaviyo to client email list','Use Claude to draft 2 campaigns/month based on seasonal calendar','Send draft to owner via email for approval with one-click approve link','Schedule and send via Mailchimp/Klaviyo API after approval','Track opens, clicks, and attributed bookings monthly'],
    buildPrompt:'Write a promotional email for [Business Name], a [category] in [city]. Offer: [OFFER]. Tone: warm, local, personal — like the owner wrote it.\n\nSubject line options: [3 options]\nPreview text: [1 line]\nBody: 3-4 short paragraphs\nCTA button: [text] → [booking link]',
    pitch:{call:'Do you have a customer email list?\n\n[PAUSE]\n\n2 campaigns/month, fully AI-written, you approve before send. One promo to 300 people = 15-25 bookings.\n\n$99/month.',email:'Subject: Your email list is money you\'re not collecting.\n\n2 AI-crafted campaigns/month. You review before send. $99/month.\n\n[Your Name]',sms:'Hi [Name], 2 AI email campaigns/month. One promo = 15-25 bookings. $99/mo, first draft free. [Your Name]'}},
  {id:'referral',cat:'rev',name:'AI Referral Program',price:'$79–$149/mo',tag:'Word of Mouth',tagC:'teal',desc:'After each visit, customers get a unique referral link. Both parties auto-rewarded.',
    bullets:['Unique referral link per customer via SMS','Both parties rewarded automatically','14 new customers in month 1 avg','Monthly revenue attribution report'],
    build:['Generate unique referral codes per customer (store in Airtable/Supabase)','Send referral link via SMS after each visit','Track referral conversions when new customer books using code','Auto-send reward (discount code or gift) to both parties via SMS','Monthly report: referrals sent, converted, revenue generated'],
    buildPrompt:'Write a post-visit referral SMS for [Business Name]:\n\n"Thanks for coming in, [Name]! If you enjoyed your experience, share your referral link with friends: [LINK]. When they book, you both get [REWARD]. Thanks for spreading the word! — [Business Name]"',
    pitch:{call:'What % of new customers come from word of mouth?\n\n[PAUSE]\n\nThat\'s your best channel and it\'s completely unmanaged. After every visit, customers get a referral link. One shop got 14 new customers in month one.\n\n$99/month.',email:'Subject: Your best customers could be sending you new ones automatically.\n\nAutomated referral program. Friend books via link, both rewarded. 14 new customers month 1 for one client.\n\n$99/month.\n\n[Your Name]',sms:'Hi [Name], automated referral program. 14 new customers month 1 avg. $99/mo. [Your Name]'}},
]

const SCORE_COLOR = (s: number) => s >= 70 ? '#c9a84c' : s >= 50 ? '#2dd4bf' : '#8a93a8'
const INI = (n: string) => { const p = (n||'').split(' '); return p.length >= 2 ? (p[0][0]||'') + (p[1][0]||'') : (n||'').slice(0,2) }

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0b0d;--bg2:#111318;--bg3:#181c23;--bg4:#1e2430;
  --b:rgba(255,255,255,.06);--b2:rgba(255,255,255,.11);--b3:rgba(255,255,255,.18);
  --gold:#c9a84c;--gd:rgba(201,168,76,.1);--gd2:rgba(201,168,76,.05);
  --teal:#2dd4bf;--td:rgba(45,212,191,.1);
  --green:#4ade80;--red:#f87171;--blue:#60a5fa;
  --t:#e8eaf0;--t2:#8a93a8;--t3:#4a5568;
  --serif:'Playfair Display',serif;--sans:'Instrument Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
}
body{background:var(--bg);color:var(--t);font-family:var(--sans);-webkit-font-smoothing:antialiased}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
.spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.1);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite}
.ldot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 2s ease-in-out infinite;display:inline-block}
input,select,textarea{font-family:var(--sans);font-size:13px;width:100%;padding:9px 12px;border-radius:4px;border:1px solid var(--b2);background:var(--bg3);color:var(--t);outline:none;transition:border-color .14s,box-shadow .14s}
input:focus,select:focus,textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1)}
input::placeholder,textarea::placeholder{color:var(--t3)}

/* NAV */
.nav{position:sticky;top:0;z-index:100;height:54px;display:flex;align-items:center;background:rgba(10,11,13,.95);border-bottom:1px solid var(--b);backdrop-filter:blur(20px)}
.nlogo{font-family:var(--serif);font-size:17px;font-weight:700;color:var(--t);text-decoration:none;letter-spacing:-.02em;padding:0 20px 0 22px;flex-shrink:0}
.nlogo span{color:var(--gold)}
.ntab{height:54px;padding:0 14px;display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:var(--t2);cursor:pointer;border:none;background:none;border-bottom:1.5px solid transparent;transition:all .13s;white-space:nowrap;font-family:var(--sans)}
.ntab:hover{color:var(--t)}
.ntab.on{color:var(--gold);border-bottom-color:var(--gold)}
.nbadge{padding:1px 5px;border-radius:2px;font-family:var(--mono);font-size:9px;font-weight:600}
.nbadge.g{background:var(--gd);color:var(--gold)}
.nbadge.t{background:var(--td);color:var(--teal)}
.nbadge.r{background:rgba(248,113,113,.1);color:var(--red)}
.nright{margin-left:auto;display:flex;align-items:center;gap:10px;padding:0 18px}
.npill{padding:3px 10px;border-radius:3px;font-family:var(--mono);font-size:11px}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;border-radius:4px;border:1px solid var(--b2);background:rgba(255,255,255,.04);color:var(--t2);cursor:pointer;font-family:var(--sans);font-size:12px;font-weight:600;transition:all .14s;white-space:nowrap;text-decoration:none}
.btn:hover{background:rgba(255,255,255,.07);border-color:var(--b3);color:var(--t)}
.btn:disabled{opacity:.35;cursor:not-allowed}
.btn-gold{background:var(--gold)!important;border-color:var(--gold)!important;color:#0a0b0d!important;font-weight:700!important}
.btn-gold:hover{background:#b8973e!important}
.btn-lg{padding:12px 28px;font-size:14px;font-family:var(--serif);font-weight:700;letter-spacing:-.01em}

/* TAGS */
.tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:3px;font-family:var(--mono);font-size:10px;font-weight:600;letter-spacing:.04em}
.tag-gold{background:var(--gd);color:var(--gold);border:1px solid rgba(201,168,76,.22)}
.tag-teal{background:var(--td);color:var(--teal);border:1px solid rgba(45,212,191,.22)}
.tag-gray{background:rgba(255,255,255,.05);color:var(--t2);border:1px solid var(--b)}
.tag-green{background:rgba(74,222,128,.1);color:var(--green);border:1px solid rgba(74,222,128,.22)}
.tag-red{background:rgba(248,113,113,.1);color:var(--red);border:1px solid rgba(248,113,113,.22)}

/* LEAD HUNTER */
.lh-wrap{display:grid;grid-template-columns:340px 1fr;min-height:calc(100vh - 54px)}
.lh-panel{padding:24px 20px;border-right:1px solid var(--b);background:var(--bg2);display:flex;flex-direction:column;gap:16px;overflow-y:auto;max-height:calc(100vh - 54px);position:sticky;top:54px}
.lh-main{flex:1;background:var(--bg);overflow-y:auto}
.panel-ey{display:flex;align-items:center;gap:7px;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase}
.panel-h{font-family:var(--serif);font-size:20px;font-weight:700;letter-spacing:-.02em;line-height:1.25}
.panel-h em{font-style:italic;color:var(--t2)}
.panel-p{font-size:12px;color:var(--t2);line-height:1.72}
.lbl{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);margin-bottom:5px;display:block}
.cats-wrap{display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;padding-right:2px}
.cat-group{margin-bottom:4px}
.cat-group-title{font-family:var(--mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--t3);margin-bottom:5px;padding-left:2px}
.cat-chips{display:flex;flex-wrap:wrap;gap:4px}
.cat-chip{padding:3px 9px;font-size:11px;background:rgba(255,255,255,.04);border:1px solid var(--b);border-radius:3px;color:var(--t2);cursor:pointer;transition:all .11s;font-family:var(--mono);white-space:nowrap}
.cat-chip:hover,.cat-chip.on{background:var(--gd);border-color:rgba(201,168,76,.25);color:var(--gold)}
.run-btn{width:100%;padding:13px;background:var(--gold);border:none;border-radius:4px;font-family:var(--serif);font-size:15px;font-weight:700;color:#0a0b0d;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-.01em}
.run-btn:hover{background:#b8973e;transform:translateY(-1px);box-shadow:0 4px 16px rgba(201,168,76,.2)}
.run-btn:disabled{opacity:.38;cursor:not-allowed;transform:none!important;box-shadow:none!important}

/* EMPTY STATE */
.empty-state{display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 54px);position:relative;overflow:hidden}
.empty-state::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.015) 1px,transparent 1px);background-size:60px 60px}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--b);border:1px solid var(--b);border-radius:4px;overflow:hidden;max-width:400px;width:100%;position:relative;z-index:1}
.stat-cell{padding:22px 20px;background:var(--bg2);text-align:center;transition:background .15s}
.stat-cell:hover{background:var(--bg3)}
.stat-n{font-family:var(--serif);font-size:38px;font-weight:700;letter-spacing:-.03em;line-height:1;color:var(--gold);margin-bottom:6px}
.stat-d{font-size:11px;color:var(--t2);line-height:1.5}

/* RESULTS BAR */
.rbar{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:rgba(10,11,13,.9);border-bottom:1px solid var(--b);backdrop-filter:blur(12px);position:sticky;top:54px;z-index:50;flex-wrap:wrap;gap:8px}
.rpill{display:flex;align-items:center;gap:5px;padding:3px 10px;background:var(--bg3);border:1px solid var(--b);border-radius:3px;font-family:var(--mono);font-size:10px;color:var(--t2)}
.rdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}

/* LEAD CARDS */
.lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1px;background:var(--b);border:1px solid var(--b);border-radius:4px;overflow:hidden;margin:16px}
.lcard{background:var(--bg2);padding:18px;display:flex;flex-direction:column;gap:11px;position:relative;overflow:hidden;transition:background .14s;animation:fadeUp .3s ease both}
.lcard:hover{background:var(--bg3)}
.lcard-bar{position:absolute;top:0;left:0;right:0;height:2px}
.lc-top{display:flex;align-items:flex-start;gap:10px}
.lc-ini{width:36px;height:36px;border-radius:3px;flex-shrink:0;background:var(--gd);border:1px solid rgba(201,168,76,.18);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:14px;font-weight:700;color:var(--gold)}
.lc-name{font-family:var(--serif);font-size:14px;font-weight:700;color:var(--t);line-height:1.2;margin-bottom:2px}
.lc-cat{font-family:var(--mono);font-size:10px;color:var(--t3)}
.lc-stars{font-family:var(--mono);font-size:11px;color:var(--gold);margin-left:auto;white-space:nowrap;flex-shrink:0}
.sc-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}
.sc-ring{width:26px;height:26px;border-radius:50%;border:1.5px solid;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;font-family:var(--mono)}
.sc-bar{height:2px;background:var(--bg4);border-radius:1px;overflow:hidden}
.sc-fill{height:100%;border-radius:1px}
.reasons{display:flex;flex-direction:column;gap:3px}
.rsn{display:flex;align-items:flex-start;gap:7px;font-size:11px;color:var(--t2);line-height:1.5}
.contacts{display:flex;flex-direction:column;gap:4px}
.ci{display:flex;align-items:flex-start;gap:8px;font-size:12px}
.ck{color:var(--t3);width:14px;flex-shrink:0;font-size:11px}
.cv{color:var(--t2);line-height:1.4;word-break:break-all}
.cv-link{color:var(--gold);cursor:pointer;text-decoration:none}
.divider{height:1px;background:var(--b)}
.card-acts{display:flex;gap:6px}
.ca-btn{flex:1;padding:9px;border-radius:4px;cursor:pointer;transition:all .13s;text-align:center;border:none;font-family:var(--serif);font-size:12px;font-weight:700;letter-spacing:-.01em}
.ca-pri{background:var(--gold);color:#0a0b0d}
.ca-pri:hover{background:#b8973e}
.ca-sec{background:rgba(255,255,255,.05);border:1px solid var(--b);color:var(--t2)}
.ca-sec:hover{background:rgba(255,255,255,.08);color:var(--t)}

/* AI TOOLS */
.tools-page{max-width:1200px;margin:0 auto;padding:40px 28px}
.tools-header{max-width:640px;margin-bottom:40px}
.cat-filters{display:flex;gap:6px;flex-wrap:wrap;margin-top:20px}
.cf{padding:5px 14px;border-radius:3px;font-family:var(--mono);font-size:11px;font-weight:500;border:1px solid var(--b);background:transparent;color:var(--t2);cursor:pointer;transition:all .12s}
.cf.on,.cf:hover{border-color:rgba(201,168,76,.25);background:var(--gd);color:var(--gold)}
.rev-strip{background:var(--bg2);border:1px solid var(--b);border-radius:4px;padding:20px 24px;margin-bottom:32px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;position:relative;overflow:hidden}
.rev-strip::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,var(--gold),var(--teal))}
.rev-num{padding:12px 16px;background:var(--bg3);border:1px solid var(--b);border-radius:4px;text-align:center;min-width:80px}
.rev-num.hi{background:var(--gd);border-color:rgba(201,168,76,.2)}
.rev-n{font-family:var(--serif);font-size:22px;font-weight:700;line-height:1;color:var(--gold)}
.rev-l{font-family:var(--mono);font-size:10px;color:var(--t3);margin-top:3px;line-height:1.4}
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1px;background:var(--b);border:1px solid var(--b);border-radius:4px;overflow:hidden}
.tc{background:var(--bg2);padding:22px;display:flex;flex-direction:column;transition:background .15s;position:relative;overflow:hidden}
.tc:hover{background:var(--bg3)}
.tc::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:0;transition:opacity .22s}
.tc:hover::after{opacity:1}
.tc-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;gap:8px}
.tc-icon{width:36px;height:36px;border-radius:4px;background:var(--bg3);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.tc-name{font-family:var(--serif);font-size:15px;font-weight:700;color:var(--t);margin-bottom:6px}
.tc-desc{font-size:12px;color:var(--t2);line-height:1.65;margin-bottom:12px}
.tc-buls{display:flex;flex-direction:column;gap:4px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--b)}
.tcb{font-size:11px;color:var(--t2);display:flex;align-items:flex-start;gap:7px;line-height:1.5}
.tcb::before{content:'--';color:var(--gold);font-family:var(--mono);font-size:10px;flex-shrink:0;margin-top:1px}
.tc-acts{display:flex;gap:7px;margin-top:auto}

/* MODAL */
.mov{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto;backdrop-filter:blur(12px);animation:fadeUp .2s ease}
.modal{width:100%;max-width:680px;background:var(--bg2);border:1px solid var(--b2);border-radius:4px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.7)}
.mh{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--b);background:var(--bg3)}
.mey{font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:3px}
.mtt{font-family:var(--serif);font-size:18px;font-weight:700;color:var(--t)}
.mcls{width:28px;height:28px;background:rgba(255,255,255,.05);border:1px solid var(--b);color:var(--t2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;border-radius:3px}
.mcls:hover{color:var(--t)}
.mtabs{display:flex;padding:0 22px;border-bottom:1px solid var(--b)}
.mtab{padding:10px 14px;font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:var(--t3);cursor:pointer;border:none;background:none;border-bottom:1.5px solid transparent;transition:all .12s}
.mtab:hover{color:var(--t2)}
.mtab.on{color:var(--gold);border-bottom-color:var(--gold)}
.mb{padding:18px 22px}
.mtip{display:flex;align-items:center;gap:7px;padding:8px 12px;background:var(--gd2);border:1px solid rgba(201,168,76,.12);border-radius:3px;font-family:var(--mono);font-size:10px;color:var(--gold);margin-bottom:12px}
.cblock{background:var(--bg);border:1px solid var(--b);border-radius:4px;padding:14px;font-family:var(--mono);font-size:11px;line-height:1.85;color:var(--t2);white-space:pre-wrap;max-height:360px;overflow-y:auto}
.step-list{display:flex;flex-direction:column;gap:8px}
.step-item{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;background:var(--bg3);border-radius:4px;font-size:12px;color:var(--t2);line-height:1.55}
.step-n{width:22px;height:22px;border-radius:50%;background:var(--gd);border:1px solid rgba(201,168,76,.2);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:10px;color:var(--gold);flex-shrink:0}

/* DASHBOARD PAGE */
.db-page{max-width:1100px;margin:0 auto;padding:32px 28px}
.db-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--b);border:1px solid var(--b);border-radius:4px;overflow:hidden;margin-bottom:32px}
.db-stat{background:var(--bg2);padding:20px;transition:background .14s}
.db-stat:hover{background:var(--bg3)}
.db-stat-n{font-family:var(--serif);font-size:32px;font-weight:700;letter-spacing:-.03em;color:var(--gold);line-height:1;margin-bottom:5px}
.db-stat-l{font-family:var(--mono);font-size:10px;color:var(--t3);letter-spacing:.06em;text-transform:uppercase}
.db-stat-sub{font-family:var(--mono);font-size:11px;color:var(--t2);margin-top:4px}
.section-h{font-family:var(--serif);font-size:18px;font-weight:700;color:var(--t);margin-bottom:16px;letter-spacing:-.02em}
.table-wrap{background:var(--bg2);border:1px solid var(--b);border-radius:4px;overflow:hidden;margin-bottom:28px}
.table-head{display:grid;padding:10px 16px;border-bottom:1px solid var(--b);background:var(--bg3)}
.th{font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--t3)}
.table-row{display:grid;padding:12px 16px;border-bottom:1px solid var(--b);transition:background .12s;align-items:center}
.table-row:last-child{border-bottom:none}
.table-row:hover{background:var(--bg3)}
.tr-val{font-size:12px;color:var(--t2)}
.tr-val.bold{color:var(--t);font-weight:600}

/* COMING SOON */
.cs-page{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 54px);text-align:center;padding:40px}
.cs-icon{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 20px}

/* SETTINGS */
.settings-page{max-width:680px;margin:0 auto;padding:40px 28px}
.settings-section{background:var(--bg2);border:1px solid var(--b);border-radius:4px;overflow:hidden;margin-bottom:20px}
.ss-head{padding:16px 20px;border-bottom:1px solid var(--b);background:var(--bg3)}
.ss-title{font-family:var(--serif);font-size:16px;font-weight:700;color:var(--t)}
.ss-body{padding:20px;display:flex;flex-direction:column;gap:14px}
.field-row{display:flex;flex-direction:column;gap:6px}
.danger-zone{background:rgba(248,113,113,.05);border-color:rgba(248,113,113,.2)}

@media(max-width:768px){
  .lh-wrap{grid-template-columns:1fr}
  .lh-panel{position:static;max-height:none}
  .db-grid{grid-template-columns:1fr 1fr}
}
`

type ModalState = { tool: string, tab: 'pitch-call'|'pitch-email'|'pitch-sms'|'build'|'prompt' } | null

export default function DashboardClient({ user, subscription }: any) {
  const [tab, setTab] = useState<'leads'|'tools'|'dashboard'|'re'|'settings'>('leads')
  const [location, setLocation] = useState('Miami, FL')
  const [category, setCategory] = useState('barbershop')
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toolFilter, setToolFilter] = useState('all')
  const [modal, setModal] = useState<ModalState>(null)
  const [briefModal, setBriefModal] = useState<string|null>(null)
  const [showCats, setShowCats] = useState(false)
  const [searches, setSearches] = useState<any[]>([])
  const [settingsMsg, setSettingsMsg] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPass, setNewPass] = useState('')

  const plan = subscription?.plans?.name || 'Starter'
  const used = subscription?.searches_used || 0
  const limit = subscription?.plans?.searches_limit ?? 2
  const isEnt = subscription?.plan_id === 'enterprise'
  const remaining = isEnt ? 'Unlimited' : `${limit - used} remaining`

  async function runScan() {
    if (!location || !category) return
    setLoading(true); setError(''); setLeads([])
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location, category }) })
      const data = await res.json()
      if (res.status === 403) setError('Search limit reached. Upgrade to continue.')
      else if (data.leads) setLeads(data.leads)
    } catch { setError('Something went wrong. Try again.') }
    setLoading(false)
  }

  const filteredTools = toolFilter === 'all' ? TOOLS : TOOLS.filter(t => t.cat === toolFilter)
  const modalTool = modal ? TOOLS.find(t => t.id === modal.tool) : null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--t)' }}>
      <style>{CSS}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="nav">
        <a href="/" className="nlogo">LeadHunter <span>Pro</span></a>
        <button className={`ntab${tab==='leads'?' on':''}`} onClick={() => setTab('leads')}>Lead Hunter</button>
        <button className={`ntab${tab==='tools'?' on':''}`} onClick={() => setTab('tools')}>AI Tools<span className="nbadge g" style={{marginLeft:5}}>12</span></button>
        <button className={`ntab${tab==='dashboard'?' on':''}`} onClick={() => setTab('dashboard')}>My Dashboard</button>
        <button className="ntab" style={{opacity:.55}} onClick={() => setTab('re')}>Real Estate<span className="nbadge r" style={{marginLeft:5}}>SOON</span></button>
        <button className={`ntab${tab==='settings'?' on':''}`} onClick={() => setTab('settings')}>Settings</button>
        <div className="nright">
          <span className="npill" style={{background:'var(--gd)',border:'1px solid rgba(201,168,76,.2)',color:'var(--gold)'}}>{plan} · {remaining}</span>
          <span style={{fontSize:'11px',color:'var(--t2)',fontFamily:'var(--mono)'}}>{user.email}</span>
        </div>
      </nav>

      {/* ── LEAD HUNTER ─────────────────────────────────────── */}
      {tab === 'leads' && (
        <div className="lh-wrap">
          <div className="lh-panel">
            <div>
              <div className="panel-ey" style={{color:'var(--gold)',marginBottom:8}}><span className="ldot" style={{marginRight:4}}></span>No-Website Lead Finder</div>
              <div className="panel-h">Find businesses <em>without a web presence.</em></div>
              <p className="panel-p" style={{marginTop:7}}>Every result is a business with no real website — scored by opportunity strength.</p>
            </div>

            <div>
              <label className="lbl">Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Miami, FL" onKeyDown={e => e.key==='Enter'&&runScan()} />
            </div>

            <div>
              <label className="lbl">Business Category</label>
              <input value={category} onChange={e => setCategory(e.target.value)} placeholder="barbershop" onKeyDown={e => e.key==='Enter'&&runScan()}
                onFocus={() => setShowCats(true)} />
              {showCats && (
                <div style={{marginTop:8}}>
                  <div className="cats-wrap">
                    {Object.entries(CATS).map(([group, items]) => (
                      <div key={group} className="cat-group">
                        <div className="cat-group-title">{group}</div>
                        <div className="cat-chips">
                          {items.map(item => (
                            <button key={item} className={`cat-chip${category.toLowerCase()===item.toLowerCase()?' on':''}`}
                              onClick={() => { setCategory(item); setShowCats(false) }}>{item}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button style={{marginTop:6,fontSize:11,color:'var(--t3)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--mono)'}} onClick={() => setShowCats(false)}>Hide categories ↑</button>
                </div>
              )}
              {!showCats && <button style={{marginTop:5,fontSize:11,color:'var(--gold)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--mono)'}} onClick={() => setShowCats(true)}>Browse 100+ categories ↓</button>}
            </div>

            {error && <div style={{padding:'9px 12px',background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.18)',borderRadius:4,color:'var(--red)',fontSize:12}}>{error}</div>}

            <button className="run-btn" disabled={loading} onClick={runScan}>
              {loading ? <><span className="spin"></span>Scanning...</> : 'Run Lead Scan'}
            </button>

            <div style={{borderTop:'1px solid var(--b)',paddingTop:14}}>
              <div className="lbl" style={{marginBottom:8}}>Quick examples</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {[['Miami Beach FL','Hair Salon'],['Austin TX','Auto Repair'],['Brooklyn NY','Restaurant'],['Chicago IL','Dentist'],['Atlanta GA','Nail Salon'],['Houston TX','Barbershop']].map(([loc,cat]) => (
                  <button key={loc} className="cat-chip" onClick={() => { setLocation(loc); setCategory(cat); setShowCats(false) }}>{cat}, {loc.split(' ')[0]}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="lh-main">
            {leads.length === 0 ? (
              <div className="empty-state">
                <div className="stat-grid">
                  <div className="stat-cell"><div className="stat-n">38%</div><div className="stat-d">of US small businesses have no real website</div></div>
                  <div className="stat-cell"><div className="stat-n">$1.2K</div><div className="stat-d">average website sale per closed lead</div></div>
                  <div className="stat-cell"><div className="stat-n">60s</div><div className="stat-d">to generate a complete brief and pitch</div></div>
                  <div className="stat-cell"><div className="stat-n">$6.7K</div><div className="stat-d">year-one value: site plus three AI tools</div></div>
                </div>
              </div>
            ) : (
              <>
                <div className="rbar">
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <div className="rpill"><span className="rdot" style={{background:'var(--gold)'}}></span>{leads.length} no-website leads</div>
                    <div className="rpill">{location}</div>
                    <div className="rpill">{category}</div>
                  </div>
                  <button className="btn btn-gold" onClick={() => setLeads([])}>New Search</button>
                </div>
                <div className="lgrid">
                  {leads.map((lead, i) => {
                    const sc = SCORE_COLOR(lead.score)
                    return (
                      <div key={i} className="lcard" style={{animationDelay:`${i*0.04}s`}}>
                        <div className="lcard-bar" style={{background:`linear-gradient(90deg,${sc},${sc}66)`}}></div>
                        <div className="lc-top">
                          <div className="lc-ini">{INI(lead.place.name||'')}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div className="lc-name">{lead.place.name}</div>
                            <div className="lc-cat">{category} · {location.split(',')[0]}</div>
                          </div>
                          {lead.place.rating && <div className="lc-stars">{lead.place.rating}★ ({lead.place.user_ratings_total})</div>}
                        </div>
                        <div>
                          <div className="sc-row">
                            <div style={{display:'flex',alignItems:'center',gap:6}}>
                              <div className="sc-ring" style={{borderColor:sc,color:sc}}>{lead.score}</div>
                              <span style={{fontFamily:'var(--mono)',fontSize:'10px',color:sc,letterSpacing:'.04em'}}>{lead.confidence}</span>
                            </div>
                            <span style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--t3)'}}>no-website confidence</span>
                          </div>
                          <div className="sc-bar"><div className="sc-fill" style={{width:`${lead.score}%`,background:`linear-gradient(90deg,${sc},${sc}88)`}}></div></div>
                        </div>
                        {lead.reasons.length > 0 && (
                          <div className="reasons">{lead.reasons.map((r: string, j: number) => (
                            <div key={j} className="rsn"><span style={{color:sc,fontFamily:'var(--mono)',fontSize:'10px',flexShrink:0}}>--</span>{r}</div>
                          ))}</div>
                        )}
                        <div className="divider"></div>
                        <div className="contacts">
                          <div className="ci"><span className="ck">@</span><span className="cv">{lead.place.formatted_address}</span></div>
                          {lead.place.formatted_phone_number && <div className="ci"><span className="ck">T</span><a href={`tel:${lead.place.formatted_phone_number}`} className="cv cv-link">{lead.place.formatted_phone_number}</a></div>}
                          {lead.place.website && <div className="ci"><span className="ck">W</span><a href={lead.place.website} target="_blank" rel="noopener" className="cv cv-link" style={{fontSize:11}}>{lead.place.website}</a></div>}
                        </div>
                        <div className="divider"></div>
                        <div className="card-acts">
                          <button className="ca-btn ca-pri" onClick={() => setBriefModal(lead.place.name)}>Developer Brief</button>
                          <button className="ca-btn ca-sec" onClick={() => setModal({tool:'receptionist',tab:'pitch-call'})}>Pitch Script</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── AI TOOLS ─────────────────────────────────────────── */}
      {tab === 'tools' && (
        <div className="tools-page">
          <div className="tools-header">
            <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:12}}>
              <span style={{width:22,height:1,background:'var(--gold)',display:'inline-block'}}></span>
              <span style={{fontFamily:'var(--mono)',fontSize:'10px',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)'}}>12 tools · Build guides + pitch scripts included</span>
            </div>
            <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,4vw,48px)',fontWeight:700,letterSpacing:'-.025em',color:'var(--t)',marginBottom:10,lineHeight:1.1}}>
              The AI toolkit every small business needs.<br/><span style={{color:'var(--gold)',fontStyle:'italic'}}>Build. Sell. Collect every month.</span>
            </h1>
            <p style={{fontSize:14,color:'var(--t2)',lineHeight:1.75,marginBottom:20}}>Each tool has a complete build guide so you can deploy it, and a full pitch script so you can sell it. Build once, collect monthly.</p>
            <div className="cat-filters">
              {[['all','All Tools'],['comm','Communication'],['mktg','Marketing'],['ops','Operations'],['rev','Revenue']].map(([c,l]) => (
                <button key={c} className={`cf${toolFilter===c?' on':''}`} onClick={() => setToolFilter(c)}>{l}</button>
              ))}
            </div>
          </div>

          <div className="rev-strip">
            <div style={{flex:1,minWidth:200}}>
              <div style={{fontFamily:'var(--mono)',fontSize:'9px',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>Revenue projection per client</div>
              <div style={{fontFamily:'var(--serif)',fontSize:17,fontWeight:700,color:'var(--t)'}}>Website + 3 tools = $6,700+ in year one</div>
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {[['$1K','Website\none-time','var(--green)'],['$475/mo','3 tools\nrecurring','var(--gold)'],['$6.7K','Year one\nper client','var(--gold)']].map(([n,l,c],i) => (
                <div key={i} className={`rev-num${i===2?' hi':''}`}>
                  <div className="rev-n" style={{color:c}}>{n}</div>
                  <div className="rev-l" style={{whiteSpace:'pre'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="tgrid">
            {filteredTools.map(t => (
              <div key={t.id} className="tc">
                <div className="tc-head">
                  <div className="tc-icon">⚡</div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                    <span className={`tag tag-${t.tagC}`}>{t.tag}</span>
                    <span className="tag tag-gray">{t.price}</span>
                  </div>
                </div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-desc">{t.desc}</div>
                <div className="tc-buls">{t.bullets.map((b,i) => <div key={i} className="tcb">{b}</div>)}</div>
                <div className="tc-acts">
                  <button className="btn btn-gold" style={{flex:1}} onClick={() => setModal({tool:t.id,tab:'pitch-call'})}>Pitch Script</button>
                  <button className="btn" style={{flex:1}} onClick={() => setModal({tool:t.id,tab:'build'})}>How to Build</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MY DASHBOARD ─────────────────────────────────────── */}
      {tab === 'dashboard' && (
        <div className="db-page">
          <div style={{marginBottom:28}}>
            <div style={{fontFamily:'var(--serif)',fontSize:'clamp(24px,3vw,36px)',fontWeight:700,letterSpacing:'-.02em',marginBottom:6}}>My Dashboard</div>
            <p style={{fontSize:13,color:'var(--t2)'}}>Track your searches, deals, and recurring revenue.</p>
          </div>

          <div className="db-grid">
            <div className="db-stat"><div className="db-stat-n">{used}</div><div className="db-stat-l">Searches Used</div><div className="db-stat-sub">{remaining} left this month</div></div>
            <div className="db-stat"><div className="db-stat-n" style={{color:'var(--green)'}}>0</div><div className="db-stat-l">Deals Closed</div><div className="db-stat-sub">Log your first win →</div></div>
            <div className="db-stat"><div className="db-stat-n" style={{color:'var(--teal)'}}>0</div><div className="db-stat-l">AI Tools Sold</div><div className="db-stat-sub">$0 MRR so far</div></div>
            <div className="db-stat"><div className="db-stat-n" style={{color:'var(--gold)'}}>$0</div><div className="db-stat-l">Monthly Recurring Revenue</div><div className="db-stat-sub">From AI tools sold</div></div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:28}}>
            <div>
              <div className="section-h">Recent Searches</div>
              <div className="table-wrap">
                <div className="table-head" style={{gridTemplateColumns:'1fr 80px 80px'}}>
                  <span className="th">Location / Category</span>
                  <span className="th">Leads</span>
                  <span className="th">Date</span>
                </div>
                {used === 0 ? (
                  <div style={{padding:'28px 16px',textAlign:'center',color:'var(--t3)',fontFamily:'var(--mono)',fontSize:11}}>No searches yet. Run your first scan.</div>
                ) : (
                  <div className="table-row" style={{gridTemplateColumns:'1fr 80px 80px'}}>
                    <span className="tr-val bold">{location} · {category}</span>
                    <span className="tr-val">{leads.length}</span>
                    <span className="tr-val">Today</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="section-h">Plan & Billing</div>
              <div className="table-wrap">
                <div style={{padding:'16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--t2)'}}>Current Plan</span>
                    <span className="tag tag-gold">{plan}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--t2)'}}>Searches</span>
                    <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--t)'}}>{used} / {isEnt ? '∞' : limit}</span>
                  </div>
                  <div style={{height:4,background:'var(--bg4)',borderRadius:2,overflow:'hidden',marginBottom:16}}>
                    <div style={{height:'100%',width:`${isEnt?30:(used/limit)*100}%`,background:'linear-gradient(90deg,var(--gold),#b8973e)',borderRadius:2}}></div>
                  </div>
                  {plan === 'Starter' && (
                    <button className="btn btn-gold" style={{width:'100%',justifyContent:'center',padding:'10px'}} onClick={() => setTab('settings')}>
                      Upgrade to Professional — $100/mo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-h">Deals Tracker</div>
            <div className="table-wrap">
              <div className="table-head" style={{gridTemplateColumns:'2fr 1fr 1fr 100px'}}>
                <span className="th">Business Name</span>
                <span className="th">Project Value</span>
                <span className="th">AI Tools MRR</span>
                <span className="th">Status</span>
              </div>
              <div style={{padding:'32px 16px',textAlign:'center',color:'var(--t3)',fontFamily:'var(--mono)',fontSize:11}}>
                No deals tracked yet. Close your first lead and log it here.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REAL ESTATE (COMING SOON) ─────────────────────────── */}
      {tab === 're' && (
        <div className="cs-page">
          <div className="cs-icon" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',color:'var(--blue)'}}>⌂</div>
          <div style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,4vw,48px)',fontWeight:700,letterSpacing:'-.02em',marginBottom:12}}>Real Estate Intelligence</div>
          <p style={{fontSize:14,color:'var(--t2)',maxWidth:440,lineHeight:1.78,marginBottom:28}}>Behavioral intent signals from Zillow, Realtor.com, Redfin, and Homes.com. Identify active buyers before they contact any agent. <strong style={{color:'var(--t)'}}>Coming soon.</strong></p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginBottom:32}}>
            {['Zillow intent signals','Realtor.com data','Redfin integration','AI outreach scripts'].map(f => (
              <span key={f} style={{padding:'5px 12px',background:'rgba(96,165,250,.07)',border:'1px solid rgba(96,165,250,.15)',borderRadius:3,fontFamily:'var(--mono)',fontSize:11,color:'var(--blue)'}}>{f}</span>
            ))}
          </div>
          <button className="btn" onClick={() => setTab('leads')} style={{borderColor:'rgba(96,165,250,.25)',color:'var(--blue)',background:'rgba(96,165,250,.07)'}}>Back to Lead Hunter</button>
        </div>
      )}

      {/* ── SETTINGS ─────────────────────────────────────────── */}
      {tab === 'settings' && (
        <div className="settings-page">
          <div style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:700,letterSpacing:'-.02em',marginBottom:6}}>Settings</div>
          <p style={{fontSize:13,color:'var(--t2)',marginBottom:28}}>Manage your account, billing, and preferences.</p>

          {settingsMsg && <div style={{padding:'10px 14px',background:'rgba(74,222,128,.08)',border:'1px solid rgba(74,222,128,.2)',borderRadius:4,color:'var(--green)',fontSize:12,marginBottom:16,fontFamily:'var(--mono)'}}>{settingsMsg}</div>}

          <div className="settings-section">
            <div className="ss-head"><div className="ss-title">Account</div></div>
            <div className="ss-body">
              <div className="field-row">
                <label className="lbl">Current email</label>
                <input value={user.email} disabled style={{opacity:.5}} />
              </div>
              <div className="field-row">
                <label className="lbl">New email address</label>
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new@email.com" type="email" />
              </div>
              <button className="btn btn-gold" style={{alignSelf:'flex-start'}} onClick={() => setSettingsMsg('Email update coming soon — contact support.')}>Update Email</button>
            </div>
          </div>

          <div className="settings-section">
            <div className="ss-head"><div className="ss-title">Password</div></div>
            <div className="ss-body">
              <div className="field-row">
                <label className="lbl">New password</label>
                <input value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" type="password" />
              </div>
              <button className="btn btn-gold" style={{alignSelf:'flex-start'}} onClick={() => setSettingsMsg('Password update coming soon — contact support.')}>Update Password</button>
            </div>
          </div>

          <div className="settings-section">
            <div className="ss-head"><div className="ss-title">Plan & Billing</div></div>
            <div className="ss-body">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--b)'}}>
                <div>
                  <div style={{fontSize:13,color:'var(--t)',marginBottom:2}}>Current Plan</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--t2)'}}>{used} of {isEnt?'unlimited':limit} searches used</div>
                </div>
                <span className="tag tag-gold">{plan}</span>
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {plan === 'Starter' && <button className="btn btn-gold">Upgrade to Professional — $100/mo</button>}
                {plan !== 'Enterprise' && <button className="btn">Upgrade to Enterprise — $250/mo</button>}
                <button className="btn" onClick={() => setSettingsMsg('Billing portal coming soon.')}>Manage Billing</button>
              </div>
            </div>
          </div>

          <div className="settings-section danger-zone">
            <div className="ss-head" style={{background:'rgba(248,113,113,.05)'}}><div className="ss-title" style={{color:'var(--red)'}}>Danger Zone</div></div>
            <div className="ss-body">
              <p style={{fontSize:12,color:'var(--t2)',lineHeight:1.65}}>Deleting your account is permanent and cannot be undone. All search history and data will be lost.</p>
              <button className="btn" style={{borderColor:'rgba(248,113,113,.3)',color:'var(--red)',background:'rgba(248,113,113,.05)',alignSelf:'flex-start'}} onClick={() => setSettingsMsg('To delete your account, contact support@leadhunterpro.com')}>Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOOL MODAL ───────────────────────────────────────── */}
      {modal && modalTool && (
        <div className="mov" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="mh">
              <div>
                <div className="mey">{modal.tab.startsWith('pitch') ? 'Sales Pitch Script' : modal.tab === 'build' ? 'Build Guide' : 'AI Prompt Template'}</div>
                <div className="mtt">{modalTool.name}</div>
              </div>
              <div style={{display:'flex',gap:7,alignItems:'center'}}>
                <button className="btn btn-gold" style={{padding:'5px 12px',fontSize:11}} onClick={() => {
                  const content = modal.tab === 'pitch-call' ? modalTool.pitch.call : modal.tab === 'pitch-email' ? modalTool.pitch.email : modal.tab === 'pitch-sms' ? modalTool.pitch.sms : modal.tab === 'build' ? modalTool.build.join('\n') : modalTool.buildPrompt
                  navigator.clipboard.writeText(content)
                }}>Copy</button>
                <button className="mcls" onClick={() => setModal(null)}>×</button>
              </div>
            </div>
            <div className="mtabs">
              <button className={`mtab${modal.tab==='pitch-call'?' on':''}`} onClick={() => setModal({...modal,tab:'pitch-call'})}>Call Script</button>
              <button className={`mtab${modal.tab==='pitch-email'?' on':''}`} onClick={() => setModal({...modal,tab:'pitch-email'})}>Cold Email</button>
              <button className={`mtab${modal.tab==='pitch-sms'?' on':''}`} onClick={() => setModal({...modal,tab:'pitch-sms'})}>SMS</button>
              <button className={`mtab${modal.tab==='build'?' on':''}`} onClick={() => setModal({...modal,tab:'build'})}>Build Guide</button>
              <button className={`mtab${modal.tab==='prompt'?' on':''}`} onClick={() => setModal({...modal,tab:'prompt'})}>AI Prompt</button>
            </div>
            <div className="mb">
              {(modal.tab === 'pitch-call' || modal.tab === 'pitch-email' || modal.tab === 'pitch-sms') && (
                <>
                  <div className="mtip">Replace all [bracketed] placeholders before use.</div>
                  <div className="cblock">{modal.tab === 'pitch-call' ? modalTool.pitch.call : modal.tab === 'pitch-email' ? modalTool.pitch.email : modalTool.pitch.sms}</div>
                </>
              )}
              {modal.tab === 'build' && (
                <>
                  <div className="mtip">Step-by-step guide to build and deploy this tool for a client.</div>
                  <div className="step-list">
                    {modalTool.build.map((s: string, i: number) => (
                      <div key={i} className="step-item">
                        <div className="step-n">{i+1}</div>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {modal.tab === 'prompt' && (
                <>
                  <div className="mtip">Copy this into your AI platform. Customize the [bracketed] fields for each client.</div>
                  <div className="cblock">{modalTool.buildPrompt}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── BRIEF MODAL ─────────────────────────────────────── */}
      {briefModal && (
        <div className="mov" onClick={() => setBriefModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="mh">
              <div><div className="mey">Lovable.dev Developer Brief</div><div className="mtt">{briefModal}</div></div>
              <div style={{display:'flex',gap:7,alignItems:'center'}}>
                <button className="btn btn-gold" style={{padding:'5px 12px',fontSize:11}} onClick={() => navigator.clipboard.writeText(`# Developer Brief: ${briefModal}\n\n## Objective\n${briefModal} needs a mobile-first website to help customers find them, verify services, and book appointments.\n\n## Pages\n1. Home — hero with strong CTA, service preview, top Google reviews, photo gallery\n2. Services & Pricing — full list with prices and descriptions\n3. About — owner story, years in business, neighborhood connection\n4. Contact — Google Maps embed, click-to-call, hours, booking form or link\n\n## Must-Have Features\n- Click-to-call button prominent on every page (mobile)\n- Google Maps embed on Contact page\n- Pull top 3 Google reviews onto Home page\n- Photo gallery (owner provides 8-12 images)\n- Social media links in footer\n- Booking link or form connected to existing system\n\n## Technical Requirements\n- Mobile-first responsive design\n- SSL certificate\n- Schema.org LocalBusiness JSON-LD markup\n- Google Analytics 4\n- Page load under 2 seconds\n- Google Search Console verified\n\n## Design Direction\nWarm, professional, neighborhood character. Photography-forward. Clean typography. No stock photos.\n\n## SEO Setup\n- Title: [Business Name] | [Category] in [City, State]\n- Meta description targeting local search\n- Google Business Profile updated and verified\n\n## Scope & Pricing\n4-page website. Estimated 5-7 business days. Quote: $800–$1,500 flat fee.\nPayment: 50% upfront, 50% on delivery.`)}>Copy Brief</button>
                <button className="mcls" onClick={() => setBriefModal(null)}>×</button>
              </div>
            </div>
            <div className="mb">
              <div className="mtip">Paste this directly into Lovable.dev as your project brief to generate the full site.</div>
              <div className="cblock">{`# Developer Brief: ${briefModal}\n\n## Objective\n${briefModal} needs a mobile-first website to help customers find them, verify services, and book appointments.\n\n## Pages\n1. Home — hero with strong CTA, service preview, top Google reviews, photo gallery\n2. Services & Pricing — full list with prices and descriptions\n3. About — owner story, years in business, neighborhood connection\n4. Contact — Google Maps embed, click-to-call, hours, booking form or link\n\n## Must-Have Features\n- Click-to-call button prominent on every page (mobile)\n- Google Maps embed on Contact page\n- Pull top 3 Google reviews onto Home page\n- Photo gallery (owner provides 8-12 images)\n- Social media links in footer\n- Booking link or form connected to existing system\n\n## Technical Requirements\n- Mobile-first responsive\n- SSL, Schema markup, Google Analytics 4, sub-2s load\n\n## Design Direction\nWarm, professional, neighborhood character. Photography-forward.\n\n## Scope\n4-page site. 5-7 days. $800–$1,500 flat. 50% upfront, 50% on delivery.`}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
