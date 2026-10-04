import { careerStages } from "@/data/career";

const careerTrace = careerStages.map((stage) => ({
  index: stage.number,
  duration: stage.duration,
  role: stage.role,
  company: stage.organization,
  status: stage.phase,
}));

export function HeroSystem() {
  return (
    <div
      className="recruiter-console"
      role="img"
      aria-label="Backend Developer for mobile and web applications. Backend Developer at Scaleup IT Limited since March 2025; Full Stack Developer at Arabian Services Company from June 2024 to January 2025."
    >
      <div className="recruiter-console-toolbar" aria-hidden="true">
        <span className="system-lights"><i /><i /><i /></span>
        <span>RECRUITER SNAPSHOT / 2026</span>
        <span className="system-online"><i /> ACTIVE</span>
      </div>

      <div className="recruiter-console-body" aria-hidden="true">
        <div className="recruiter-console-positioning">
          <div>
            <span>CURRENT POSITIONING</span>
            <span className="recruiter-console-signal"><i /> END-TO-END DELIVERY</span>
          </div>
          <strong>Backend · Mobile · Web</strong>
          <p>APIs, data, business logic, integrations, and reliable deployment.</p>
        </div>

        <div className="recruiter-career-trace">
          <span className="recruiter-career-line"><i /></span>
          {careerTrace.map((item) => (
            <article key={item.index}>
              <div className="recruiter-career-meta">
                <span>{item.index}</span>
                <span>{item.duration}</span>
                <span>{item.status}</span>
              </div>
              <h2>{item.role}</h2>
              <p>{item.company}</p>
            </article>
          ))}
        </div>

        <div className="recruiter-console-range">
          <span>DELIVERY RANGE</span>
          <div>
            <strong>MOBILE</strong>
            <strong>BACKEND</strong>
            <strong>DATABASES</strong>
            <strong>DEPLOYMENT</strong>
          </div>
        </div>

        <span className="recruiter-console-scan" />
      </div>

      <div className="recruiter-console-footer" aria-hidden="true">
        <span>BACKEND SYSTEMS · MOBILE &amp; WEB · PRODUCTION</span>
        <span>BANGLADESH / UTC+6</span>
      </div>
    </div>
  );
}
