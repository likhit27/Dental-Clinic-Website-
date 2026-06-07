import { testimonials } from '@/data/siteContent';

import { StarIcon } from '../icons/SvgIcons';
import { SectionHeader } from '../ui/SectionHeader';

function Stars() {
  return (
    <div className="stars" aria-label="5 star rating">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container test-container">
        <SectionHeader
          title={
            <>
              Patient <span className="highlight">Stories</span>
            </>
          }
          subtitle="Read what our patients have to say about their experience."
        />

        <div className="test-grid">
          {testimonials.map((testimonial) => (
            <div className="test-card" key={testimonial.name}>
              <div className="quote-mark">"</div>
              <Stars />
              <p className="review-text">"{testimonial.review}"</p>
              <div className="patient-info-box">
                <div className="avatar-small">{testimonial.initials}</div>
                <div className="patient-details">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.meta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
