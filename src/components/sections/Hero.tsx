import { clinicContact, heroStats, trustItems } from '@/data/siteContent';

import { DecorativeIcon } from '../ui/DecorativeIcon';

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg-glow" />

      <div className="container hero-content">
        <div className="hero-text">
          <h1 className="hero-headline">
            Your Smile, <br />
            <span className="highlight">Our Passion</span>
          </h1>
          <p className="hero-subheading">
            Expert dental care from <strong>Dr. Yogesh Trivedi</strong> {'\u2014'} BDS with 25+ years
            experience in cosmetic, implant, and general dentistry in Udaipur.
          </p>

          <div className="hero-ctas">
            <a href="#appointment" className="btn btn-primary">
              Book Appointment
            </a>
            <a
              href={clinicContact.whatsappUrl}
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Call Now
            </a>
          </div>

          <div className="hero-stats">
            {heroStats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <span className="stat-number">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="trust-bar">
        <div className="container trust-bar-inner">
          {trustItems.map((item) => (
            <span className="trust-item" key={item.label}>
              <DecorativeIcon name={item.icon} className="trust-icon" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
