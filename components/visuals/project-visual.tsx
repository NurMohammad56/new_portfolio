import {
  CheckCircle2,
  Gavel,
  MapPin,
  Newspaper,
  Play,
  Smartphone,
  Sparkles,
  Trophy,
  Target,
  BookOpen,
  Video,
  MessageSquare,
  FileText,
  Users,
  Activity,
  Calendar,
  Stethoscope,
  Server,
  ShieldCheck,
  PhoneCall,
  ShoppingBag,
  Package,
  Truck,
  Clock,
  Volume2,
} from "lucide-react";

export type ProjectVisualVariant =
  | "video-pitch"
  | "city-discovery"
  | "live-auction"
  | "mobile-app"
  | "lifestyle-goals"
  | "evpitch-mobile"
  | "docmobi-telehealth"
  | "merchandise-portal"
  | "prophetic-pathway";

type ProjectVisualProps = {
  label: string;
  variant: ProjectVisualVariant;
};

const waveform = [
  34, 58, 42, 78, 52, 88, 61, 38, 72, 94, 56, 68, 44, 82, 51, 36,
];

function BrowserBar({ domain }: { domain: string }) {
  return (
    <div className="project-art-browser">
      <div>
        <i />
        <i />
        <i />
      </div>
      <span>{domain}</span>
      <b>LIVE</b>
    </div>
  );
}

function VideoPitchVisual() {
  return (
    <div className="project-art project-art--video">
      <BrowserBar domain="evpitch.com / candidate-profile" />
      <div className="project-art-video-shell">
        <aside>
          <strong>EVP</strong>
          <i className="is-active" />
          <i />
          <i />
          <i />
          <span>MSH / 01</span>
        </aside>

        <div className="project-art-video-content">
          <header>
            <div>
              <span>CANDIDATE PROFILE</span>
              <strong>Meet the person behind the CV.</strong>
            </div>
            <span className="project-art-live-dot">
              <i /> PITCH READY
            </span>
          </header>

          <div className="project-art-video-grid">
            <div className="project-art-video-card">
              <span className="project-art-rec">
                <i /> 00:30 PITCH
              </span>
              <div className="project-art-person" aria-hidden="true">
                <i />
                <span />
              </div>
              <div className="project-art-play">
                <Play fill="currentColor" size={18} />
              </div>
              <footer>
                <span>FULL-STACK DEVELOPER</span>
                <strong>Sozib H.</strong>
              </footer>
            </div>

            <div className="project-art-pitch-panel">
              <span>VIDEO SIGNAL</span>
              <div className="project-art-wave" aria-hidden="true">
                {waveform.map((height, index) => (
                  <i
                    key={`${height}-${index}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="project-art-profile-row">
                <i>01</i>
                <span>
                  <strong>Video profile</strong>
                  <small>Candidate introduction</small>
                </span>
                <b>READY</b>
              </div>
              <div className="project-art-profile-row">
                <i>02</i>
                <span>
                  <strong>Recruiter discovery</strong>
                  <small>Job-focused profile</small>
                </span>
                <b>LIVE</b>
              </div>
              <button type="button" tabIndex={-1}>
                View candidate <span>+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CityDiscoveryVisual() {
  return (
    <div className="project-art project-art--city">
      <BrowserBar domain="walkthroughz.com / discover" />
      <div className="project-art-city-map">
        <div className="project-art-city-grid" />
        <svg
          className="project-art-route"
          viewBox="0 0 700 480"
          fill="none"
          aria-hidden="true"
        >
          <path d="M58 386C146 354 141 248 243 240C355 231 319 115 438 125C540 134 543 62 650 70" />
        </svg>

        <span className="project-art-pin project-art-pin--one">
          <i>
            <MapPin size={14} />
          </i>
          <b>01</b>
        </span>
        <span className="project-art-pin project-art-pin--two">
          <i>
            <MapPin size={14} />
          </i>
          <b>02</b>
        </span>
        <span className="project-art-pin project-art-pin--three">
          <i>
            <MapPin size={14} />
          </i>
          <b>03</b>
        </span>

        <div className="project-art-city-label">
          <span>BERLIN / LIVE MAP</span>
          <strong>
            Stories shape
            <br />
            every street.
          </strong>
        </div>

        <article className="project-art-place-card">
          <div className="project-art-place-image">
            <span>LOCAL PICK</span>
            <i />
          </div>
          <div>
            <span>KREUZBERG · 2.4 KM</span>
            <strong>A local walk worth taking.</strong>
            <p>
              <i>MS</i> Curated by the people who live here
            </p>
          </div>
          <b>−20% DEAL</b>
        </article>

        <div className="project-art-map-controls">
          <button tabIndex={-1}>+</button>
          <button tabIndex={-1}>−</button>
        </div>
      </div>
    </div>
  );
}

function LiveAuctionVisual() {
  return (
    <div className="project-art project-art--auction">
      <BrowserBar domain="diamondauctionsllc.com / auctions / lot-024" />
      <div className="project-art-auction-shell">
        <header>
          <span>
            <i /> LIVE AUCTION
          </span>
          <strong>LOT 024</strong>
          <small>REGISTERED BIDDERS / 18</small>
        </header>

        <div className="project-art-auction-grid">
          <div className="project-art-diamond-stage">
            <span>EXCEPTIONAL LOT</span>
            <div className="project-art-diamond" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div>
              <span>ROUND BRILLIANT</span>
              <strong>4.02 CT</strong>
              <small>GIA CERTIFIED · VS1</small>
            </div>
          </div>

          <div className="project-art-bid-panel">
            <div className="project-art-bid-title">
              <Gavel size={17} />
              <span>LIVE BID</span>
              <b>OPEN</b>
            </div>
            <span>CURRENT BID</span>
            <strong>$24,800</strong>
            <small>USD · 12 bids received</small>

            <div className="project-art-bid-history">
              <span>
                <i>12</i>
                <b>$24,800</b>
                <small>NOW</small>
              </span>
              <span>
                <i>11</i>
                <b>$24,200</b>
                <small>1 MIN</small>
              </span>
              <span>
                <i>10</i>
                <b>$23,500</b>
                <small>3 MIN</small>
              </span>
            </div>

            <button type="button" tabIndex={-1}>
              Place next bid <span>$25,400</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const examQuestions = [
  { label: "API 510", score: 84 },
  { label: "API 570", score: 91 },
  { label: "API 653", score: 78 },
  { label: "SIRE", score: 88 },
];

function MobileAppVisual() {
  return (
    <div className="project-art project-art--mobile-app">
      <div className="project-art-mobile-top">
        <span>
          <Smartphone size={13} /> INSPECTORS PATH
        </span>
        <span className="project-art-live-dot">
          <i /> LIVE
        </span>
      </div>

      <div className="project-art-mobile-content">
        <div className="project-art-mobile-phone">
          <div className="project-art-phone-notch">
            <i />
          </div>
          <div className="project-art-phone-screen">
            <div className="project-art-phone-status">
              <span>9:41</span>
              <span className="project-art-mobile-battery">
                <i />
                <i />
              </span>
            </div>

            <div className="project-art-mobile-header">
              <span className="project-art-exam-tag">API 510</span>
              <strong>Practice Exam</strong>
              <small>Question 12 of 45</small>
            </div>

            <div className="project-art-mobile-question">
              <p>
                What is the minimum required thickness for a pressure vessel
                shell course under API 510?
              </p>
            </div>

            <div className="project-art-mobile-options">
              <span>
                <i>A</i> 1/4 in (6.4 mm)
              </span>
              <span className="is-correct">
                <i>B</i> 1/8 in (3.2 mm)
              </span>
              <span>
                <i>C</i> 3/8 in (9.5 mm)
              </span>
              <span>
                <i>D</i> 1/2 in (12.7 mm)
              </span>
            </div>

            <div className="project-art-mobile-progress">
              <div className="project-art-progress-bar">
                <b style={{ width: "27%" }} />
              </div>
              <span>27%</span>
            </div>
          </div>
          <div className="project-art-phone-home" />
        </div>

        <div className="project-art-score-cards">
          <span className="project-art-score-label">YOUR SCORES</span>
          {examQuestions.map((exam) => (
            <div className="project-art-score-row" key={exam.label}>
              <span>{exam.label}</span>
              <div className="project-art-score-bar">
                <i style={{ width: `${exam.score}%` }} />
              </div>
              <b>{exam.score}%</b>
            </div>
          ))}
          <div className="project-art-score-cta">
            <Trophy size={16} />
            <span>Improve weak areas</span>
          </div>
        </div>
      </div>

      <div className="project-art-mobile-tags">
        <span>
          <BookOpen size={11} /> Study Resources
        </span>
        <span>
          <Target size={11} /> 4 Certifications
        </span>
      </div>
    </div>
  );
}

function LifestyleGoalsVisual() {
  return (
    <div className="project-art project-art--lifestyle">
      <BrowserBar domain="splurjj.com / mimic" />
      <div className="project-art-lifestyle-shell">
        <header>
          <span>
            <Newspaper size={13} /> LIVE FEED
          </span>
          <strong>MIMIC</strong>
          <small>ARTICLE → GOAL</small>
        </header>

        <div className="project-art-lifestyle-grid">
          <div className="project-art-feed-panel">
            <span>TODAY&apos;S PICK</span>
            <div className="project-art-feed-image">
              <b>STYLE</b>
            </div>
            <strong>Build a capsule wardrobe that travels.</strong>
            <p>4 min read · The Splurjj Brief</p>
            <div className="project-art-feed-cta">
              <Sparkles size={13} />
              <span>Mimic this into a goal</span>
            </div>
          </div>

          <div className="project-art-goal-panel">
            <div className="project-art-goal-title">
              <Target size={16} />
              <span>YOUR GOAL</span>
              <b>ACTIVE</b>
            </div>
            <span>MILESTONES</span>
            <strong>Capsule wardrobe</strong>

            <div className="project-art-goal-steps">
              <span className="is-done">
                <CheckCircle2 size={13} /> Audit closet
              </span>
              <span className="is-done">
                <CheckCircle2 size={13} /> Set budget
              </span>
              <span>
                <i>3</i> Shop 5 core pieces
              </span>
            </div>

            <div className="project-art-goal-progress">
              <div className="project-art-progress-bar">
                <b style={{ width: "66%" }} />
              </div>
              <span>66%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EVPitchMobileVisual() {
  return (
    <div className="project-art project-art--mobile-app project-art--evpitch-mobile">
      <div className="project-art-mobile-top">
        <span>
          <Smartphone size={13} /> EVPitch Pro · Video Recruitment
        </span>
        <span className="project-art-live-dot">
          <i /> PLAY STORE LIVE
        </span>
      </div>

      <div className="project-art-mobile-content">
        <div className="project-art-mobile-phone">
          <div className="project-art-phone-notch">
            <i />
          </div>
          <div className="project-art-phone-screen project-art-phone-screen--video">
            <div className="project-art-phone-status">
              <span>9:41</span>
              <span className="project-art-mobile-battery">
                <i />
                <i />
              </span>
            </div>

            <div className="project-art-evp-phone-header">
              <span className="project-art-rec-badge">
                <i /> 00:30 REC
              </span>
              <span className="project-art-verified-pill">Verified</span>
            </div>

            <div className="project-art-evp-video-box">
              <div className="project-art-person project-art-person--mobile" aria-hidden="true">
                <i />
                <span />
              </div>
              <div className="project-art-evp-play-btn">
                <Play fill="currentColor" size={15} />
              </div>
              <div className="project-art-evp-video-tag">
                <strong>Alex M.</strong>
                <small>Full-Stack Developer</small>
              </div>
            </div>

            <div className="project-art-evp-audio-wave">
              {[42, 75, 50, 92, 60, 85, 45, 96, 70, 52, 82, 64].map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} />
              ))}
            </div>

            <div className="project-art-evp-quick-actions">
              <span className="is-highlight">
                <MessageSquare size={10} /> Chat
              </span>
              <span>
                <FileText size={10} /> Resume
              </span>
            </div>
          </div>
          <div className="project-art-phone-home" />
        </div>

        <div className="project-art-score-cards project-art-evp-hud">
          <span className="project-art-score-label">HIRING PLATFORM</span>

          <div className="project-art-evp-stat-card">
            <div className="project-art-evp-stat-header">
              <span className="evp-stat-title">Recruiter Workflow</span>
              <strong className="evp-stat-value">LIVE</strong>
            </div>
            <div className="project-art-score-bar">
              <i style={{ width: "100%" }} />
            </div>
          </div>

          <div className="project-art-evp-features-grid">
            <div className="project-art-evp-feat-item">
              <Video size={13} />
              <div>
                <strong>Video Introductions</strong>
                <small>30-second pitches</small>
              </div>
            </div>
            <div className="project-art-evp-feat-item">
              <Users size={13} />
              <div>
                <strong>Dual Profiles</strong>
                <small>Job Seeker & Recruiter</small>
              </div>
            </div>
            <div className="project-art-evp-feat-item">
              <MessageSquare size={13} />
              <div>
                <strong>Direct Messaging</strong>
                <small>Real-time hiring chat</small>
              </div>
            </div>
          </div>

          <div className="project-art-score-cta project-art-evp-live-cta">
            <Sparkles size={14} />
            <span>Google Play Store · Live Product</span>
          </div>
        </div>
      </div>

      <div className="project-art-mobile-tags">
        <span>
          <Video size={11} /> Video Pitches
        </span>
        <span>
          <MessageSquare size={11} /> In-App Messaging
        </span>
        <span>
          <FileText size={11} /> Smart Resumes
        </span>
      </div>
    </div>
  );
}

function DocMobiTelehealthVisual() {
  return (
    <div className="project-art project-art--mobile-app project-art--docmobi">
      <div className="project-art-mobile-top">
        <span>
          <Smartphone size={13} /> DocMobi · Telehealth & Doctor Consultations
        </span>
        <span className="project-art-live-dot">
          <i /> BACKEND & APIS LIVE
        </span>
      </div>

      <div className="project-art-mobile-content">
        <div className="project-art-mobile-phone">
          <div className="project-art-phone-notch">
            <i />
          </div>
          <div className="project-art-phone-screen project-art-phone-screen--docmobi">
            <div className="project-art-phone-status">
              <span>9:41</span>
              <span className="project-art-mobile-battery">
                <i />
                <i />
              </span>
            </div>

            <div className="project-art-docmobi-header">
              <span className="docmobi-brand">DocMobi Health</span>
              <span className="docmobi-status-pill">
                <Activity size={9} /> Online
              </span>
            </div>

            <div className="project-art-docmobi-card">
              <div className="docmobi-doctor-avatar">
                <Stethoscope size={15} />
              </div>
              <div className="docmobi-doctor-info">
                <strong>Dr. Sarah Mitchell</strong>
                <small>Consultant Physician</small>
                <div className="docmobi-rating">
                  <b>★ 4.9</b>
                  <span>(120+ reviews)</span>
                </div>
              </div>
            </div>

            <div className="project-art-docmobi-modes">
              <span className="is-active">
                <Video size={10} /> Video
              </span>
              <span>
                <PhoneCall size={10} /> Audio
              </span>
              <span>
                <MessageSquare size={10} /> Chat
              </span>
            </div>

            <div className="project-art-docmobi-slot">
              <div className="docmobi-slot-label">
                <Calendar size={10} />
                <span>Next Slot: Today, 11:30 AM</span>
              </div>
              <button type="button" tabIndex={-1}>
                Book Consultation
              </button>
            </div>
          </div>
          <div className="project-art-phone-home" />
        </div>

        <div className="project-art-score-cards project-art-docmobi-hud">
          <span className="project-art-score-label">BACKEND ARCHITECTURE & APIS</span>

          <div className="project-art-docmobi-api-box">
            <div className="docmobi-api-row">
              <span className="method post">POST</span>
              <code>/api/v1/consultations/book</code>
              <b className="status-ok">200 OK</b>
            </div>
            <div className="docmobi-api-row">
              <span className="method get">GET</span>
              <code>/api/v1/doctors/availability</code>
              <b className="status-sync">LIVE SYNC</b>
            </div>
            <div className="docmobi-api-row">
              <span className="method wss">WSS</span>
              <code>/telehealth/realtime-stream</code>
              <b className="status-active">ACTIVE</b>
            </div>
          </div>

          <div className="project-art-evp-features-grid">
            <div className="project-art-evp-feat-item">
              <Server size={13} />
              <div>
                <strong>Node.js & Express REST APIs</strong>
                <small>Scalable booking & scheduling engines</small>
              </div>
            </div>
            <div className="project-art-evp-feat-item">
              <ShieldCheck size={13} />
              <div>
                <strong>Secure Patient Data & JWT</strong>
                <small>Encrypted medical records & auth</small>
              </div>
            </div>
            <div className="project-art-evp-feat-item">
              <Activity size={13} />
              <div>
                <strong>Real-Time Socket.IO Sessions</strong>
                <small>Live audio, video & chat handling</small>
              </div>
            </div>
          </div>

          <div className="project-art-score-cta project-art-docmobi-live-cta">
            <CheckCircle2 size={14} />
            <span>Production Backend · Google Play App</span>
          </div>
        </div>
      </div>

      <div className="project-art-mobile-tags">
        <span>
          <Server size={11} /> REST APIs
        </span>
        <span>
          <Activity size={11} /> Telemedicine Backend
        </span>
        <span>
          <ShieldCheck size={11} /> Health Data Security
        </span>
      </div>
    </div>
  );
}

function MerchandisePortalVisual() {
  return (
    <div className="project-art project-art--pjswag">
      <BrowserBar domain="portal.pjswag.com / orders / configure" />
      <div className="project-art-pjswag-shell">
        <header>
          <span>
            <ShoppingBag size={13} /> SWAG & UNIFORMS
          </span>
          <strong>ENTERPRISE MERCH PORTAL</strong>
          <small>BUDGET ALLOCATED</small>
        </header>

        <div className="project-art-pjswag-grid">
          <div className="project-art-pjswag-config">
            <span className="pjswag-badge">CORPORATE APPAREL</span>
            <div className="project-art-pjswag-item-preview">
              <Package size={26} />
              <div className="pjswag-tag-embroidery">
                <span>CUSTOM EMBROIDERY</span>
              </div>
            </div>
            <strong>Team Technical Jacket</strong>
            <div className="pjswag-specs">
              <span>Size: L</span>
              <span>Color: Onyx</span>
              <span>Qty: 1</span>
            </div>
            <div className="pjswag-budget-meter">
              <div className="pjswag-budget-header">
                <span>Employee Allowance</span>
                <b>$120 / $250</b>
              </div>
              <div className="project-art-progress-bar">
                <b style={{ width: "48%" }} />
              </div>
            </div>
          </div>

          <div className="project-art-pjswag-tracking">
            <div className="pjswag-track-title">
              <Truck size={15} />
              <span>LIVE SHIPMENT TRACKING</span>
              <b>IN TRANSIT</b>
            </div>
            <span className="pjswag-order-id">ORDER #PJS-9428</span>

            <div className="pjswag-timeline">
              <div className="pjswag-timeline-step is-done">
                <CheckCircle2 size={12} />
                <div>
                  <strong>Order Placed & Approved</strong>
                  <small>Budget allocated</small>
                </div>
              </div>
              <div className="pjswag-timeline-step is-done">
                <CheckCircle2 size={12} />
                <div>
                  <strong>Custom Production & Embroidery</strong>
                  <small>Quality inspected & packed</small>
                </div>
              </div>
              <div className="pjswag-timeline-step is-active">
                <div className="pjswag-pulse-dot" />
                <div>
                  <strong>Carrier In Transit</strong>
                  <small>Tracking #PJS-9920148</small>
                </div>
              </div>
            </div>

            <div className="pjswag-track-footer">
              <span>
                Est. Delivery: <b>Tomorrow, 2:00 PM</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropheticPathwayVisual() {
  return (
    <div className="project-art project-art--prophetic">
      <BrowserBar domain="ej-ppathway-website.vercel.app / advisors / session" />
      <div className="project-art-prophetic-shell">
        <header>
          <span>
            <Sparkles size={13} /> SPIRITUAL GUIDANCE & CONSULTATION
          </span>
          <strong>PROPHETIC PATHWAY</strong>
          <small>LIVE ADVISORS ONLINE</small>
        </header>

        <div className="project-art-prophetic-grid">
          <div className="project-art-prophetic-session">
            <div className="prophetic-session-head">
              <span className="prophetic-live-badge">
                <i /> LIVE CONSULTATION
              </span>
              <span className="prophetic-timer">
                <Clock size={10} /> 14:35
              </span>
            </div>

            <div className="prophetic-advisor-card">
              <div className="prophetic-advisor-avatar">
                <Sparkles size={18} />
              </div>
              <div className="prophetic-advisor-details">
                <div className="prophetic-advisor-name-row">
                  <strong>Sarah Jenkins</strong>
                  <span className="prophetic-verified-badge">Verified</span>
                </div>
                <small>Prophetic & Spiritual Advisor</small>
                <div className="prophetic-advisor-rating">
                  <b>★ 4.98</b>
                  <span>(240+ reviews)</span>
                </div>
              </div>
            </div>

            <div className="prophetic-stream-modes">
              <span className="is-active">
                <Video size={10} /> HD Video
              </span>
              <span>
                <PhoneCall size={10} /> Audio
              </span>
              <span>
                <MessageSquare size={10} /> Live Chat
              </span>
            </div>

            <div className="prophetic-audio-visualizer">
              <div className="prophetic-audio-label">
                <Volume2 size={10} />
                <span>Audio Stream Active</span>
              </div>
              <div className="prophetic-waves">
                {[30, 65, 45, 90, 75, 50, 85, 95, 60, 40, 80, 55, 70, 90, 45, 60].map((h, i) => (
                  <i key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <div className="prophetic-billing-strip">
              <div>
                <span>Rate</span>
                <b>$2.50 / min</b>
              </div>
              <div>
                <span>Session Cost</span>
                <b>$36.25</b>
              </div>
              <span className="prophetic-wallet-badge">Wallet Linked</span>
            </div>
          </div>

          <div className="project-art-prophetic-hub">
            <div className="prophetic-hub-title">
              <Users size={14} />
              <span>ADVISORY DIRECTORY & WORKFLOW</span>
              <b>ACTIVE</b>
            </div>

            <div className="prophetic-advisor-list">
              <div className="prophetic-advisor-row is-selected">
                <div className="prophetic-status-dot online" />
                <div className="prophetic-row-info">
                  <strong>Prophetic Insight & Guidance</strong>
                  <small>Instant video / voice session</small>
                </div>
                <span className="prophetic-rate-tag">$2.50/m</span>
              </div>

              <div className="prophetic-advisor-row">
                <div className="prophetic-status-dot online" />
                <div className="prophetic-row-info">
                  <strong>Life Path & Relationship Clarity</strong>
                  <small>Verified intuitive counselor</small>
                </div>
                <span className="prophetic-rate-tag">$3.00/m</span>
              </div>
            </div>

            <div className="prophetic-features-grid">
              <div className="prophetic-feat-item">
                <ShieldCheck size={12} />
                <div>
                  <strong>Private & Encrypted</strong>
                  <small>Confidential 1-on-1 calls</small>
                </div>
              </div>
              <div className="prophetic-feat-item">
                <FileText size={12} />
                <div>
                  <strong>AI Audio Transcripts</strong>
                  <small>Recorded session archives</small>
                </div>
              </div>
              <div className="prophetic-feat-item">
                <Activity size={12} />
                <div>
                  <strong>Pay-Per-Minute</strong>
                  <small>Flexible wallet & checkout</small>
                </div>
              </div>
            </div>

            <div className="prophetic-hub-footer">
              <Sparkles size={13} />
              <span>Next.js · Tailwind CSS · WebRTC · Live Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectVisual({ label, variant }: ProjectVisualProps) {
  return (
    <div
      className="project-art-root"
      data-visual={variant}
      data-project={label}
      aria-hidden="true"
    >
      {variant === "video-pitch" && <VideoPitchVisual />}
      {variant === "city-discovery" && <CityDiscoveryVisual />}
      {variant === "live-auction" && <LiveAuctionVisual />}
      {variant === "mobile-app" && <MobileAppVisual />}
      {variant === "lifestyle-goals" && <LifestyleGoalsVisual />}
      {variant === "evpitch-mobile" && <EVPitchMobileVisual />}
      {variant === "docmobi-telehealth" && <DocMobiTelehealthVisual />}
      {variant === "merchandise-portal" && <MerchandisePortalVisual />}
      {variant === "prophetic-pathway" && <PropheticPathwayVisual />}
    </div>
  );
}
