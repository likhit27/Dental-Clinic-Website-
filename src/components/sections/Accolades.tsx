import { accolades } from '@/data/siteContent';

import { AwardIcon } from '../icons/SvgIcons';
import { SectionHeader } from '../ui/SectionHeader';

export function Accolades() {
  return (
    <section className="accolades" id="accolades">
      <div className="container acc-container">
        <SectionHeader
          title={
            <>
              Awards & <span className="highlight">Accolades</span>
            </>
          }
          subtitle="Excellence in dentistry recognized by professional medical bodies."
        />

        <div className="acc-grid">
          {accolades.map((accolade) => (
            <div className="acc-card" key={accolade.title}>
              <div className="acc-badge">
                <AwardIcon />
              </div>
              <div className="acc-content">
                <h4>{accolade.title}</h4>
                <p className="acc-org">{accolade.organization}</p>
                <p className="acc-desc">{accolade.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
