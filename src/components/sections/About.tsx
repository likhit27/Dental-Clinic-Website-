import { clinicValues, credentials, digitalWorkflow } from '@/data/siteContent';

import { SimpleCheckIcon } from '../icons/SvgIcons';
import { DecorativeIcon } from '../ui/DecorativeIcon';

export function About() {
  return (
    <section className="about-us" id="about">
      <div className="container about-container">
        <div className="about-left">
          <div className="doctor-card">
            <div className="doctor-profile-head">
              <div className="avatar-circle">
                <img
                  className="doctor-avatar-image"
                  src="/images/gallery/clinic-gallery-01.jpg"
                  alt="Dr. Yogesh Trivedi"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="doctor-name">Dr. Yogesh Trivedi</h3>
              <p className="doctor-degree">
                BDS {'\u2014'} Sawai Man Singh Medical & Dental College, Jaipur (1998)
              </p>
            </div>
            <p className="doctor-bio">
              With over two decades of clinical experience, Dr. Trivedi is passionate about
              delivering exceptional cosmetic, implant, and endodontic dentistry. He believes in a
              conservative approach to preserve natural tooth structure.
            </p>

            <ul className="credentials-list">
              {credentials.map((credential) => (
                <li key={credential}>
                  <SimpleCheckIcon className="cred-icon" />
                  {credential}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="about-right">
          <h2 className="section-title">
            About Our <span className="highlight">Clinic</span>
          </h2>
          <p className="philosophy">
            At Mani Dental Clinic, we believe in treating our patients like family. Our clinic is
            rooted in medical ethics and compassion, ensuring every patient feels understood,
            comfortable, and well-cared for. We do not compromise on the quality of our materials or
            the time we spend with you.
          </p>

          <div className="workflow-panel">
            <div className="workflow-copy">
              <span className="workflow-eyebrow">{digitalWorkflow.eyebrow}</span>
              <h3>{digitalWorkflow.title}</h3>
              <p>{digitalWorkflow.description}</p>
            </div>
            <div className="workflow-tools" aria-label="Digital workflow tools">
              {digitalWorkflow.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>

          <div className="values-grid">
            {clinicValues.map((value) => (
              <div className="value-card" key={value.title}>
                <div className="value-content">
                  <h4 className="value-title">
                    <span>{value.title}</span>
                    <span className="value-icon">
                      <DecorativeIcon name={value.icon} />
                    </span>
                  </h4>
                  <p className="value-desc">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
