import clsx from 'clsx';

import { services } from '@/data/siteContent';

import { SectionHeader } from '../ui/SectionHeader';

export function Services() {
  return (
    <section className="services" id="services">
      <div className="container services-container">
        <SectionHeader
          title={
            <>
              Our <span className="highlight">Services</span>
            </>
          }
          subtitle="Comprehensive dental care tailored for your perfect smile."
        />

        <div className="services-grid">
          {services.map((service) => (
            <div
              className={clsx('service-card', service.featured && 'service-card-featured')}
              key={service.title}
            >
              <h4 className="service-title">{service.title}</h4>
              <p className="service-desc">{service.description}</p>
              <a href="#" className="service-link">
                Learn More {'\u2192'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
