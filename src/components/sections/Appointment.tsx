import clsx from 'clsx';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { appointmentTimes, contactCards, serviceOptions } from '@/data/siteContent';

import {
  CheckCircleIcon,
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  WhatsAppIcon,
} from '../icons/SvgIcons';
import { SectionHeader } from '../ui/SectionHeader';

const socialLinks = [
  { label: 'Facebook', href: '#', icon: FacebookIcon },
  { label: 'Instagram', href: '#', icon: InstagramIcon },
  { label: 'Twitter/X', href: '#', icon: TwitterIcon },
  { label: 'LinkedIn', href: '#', icon: LinkedInIcon },
  { label: 'Google', href: '#', icon: GoogleIcon },
  { label: 'WhatsApp', href: '#', icon: WhatsAppIcon },
];

export function Appointment() {
  const formRef = useRef<HTMLFormElement>(null);
  const successTimerRef = useRef<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setShowSuccess(false);
    setIsSubmitting(true);

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: String(formData.get('firstName') ?? '').trim(),
      lastName: String(formData.get('lastName') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      date: String(formData.get('date') ?? ''),
      time: String(formData.get('time') ?? ''),
      service: String(formData.get('service') ?? ''),
      message: String(formData.get('message') ?? '').trim(),
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || 'Please try again or call the clinic directly.');
      }

      setShowSuccess(true);
      formRef.current?.reset();

      successTimerRef.current = window.setTimeout(() => {
        setShowSuccess(false);
      }, 6000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Network error. Please check your connection and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" id="appointment">
      <div className="container contact-container">
        <SectionHeader
          title={
            <>
              Contact & <span className="highlight">Appointment</span>
            </>
          }
          subtitle="Reach out to us or book your visit directly online."
        />

        <div className="contact-grid">
          <div className="contact-details">
            <div className="contact-info-grid">
              {contactCards.map((card) => (
                <div className="info-card" key={card.title}>
                  <div className="info-content">
                    <h4>{card.title}</h4>
                    {card.content.length > 0 ? (
                      <p>
                        {card.content.map((line) => (
                          <span key={line}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    ) : null}
                    {card.link ? (
                      <a
                        href={card.link.href}
                        className={card.title === 'Visit Us' ? 'text-link' : 'contact-link'}
                        target={card.link.external ? '_blank' : undefined}
                        rel={card.link.external ? 'noopener noreferrer' : undefined}
                      >
                        {card.link.label}
                      </a>
                    ) : null}
                    {card.note ? <p className="contact-note">{card.note}</p> : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="social-links">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a href={href} aria-label={label} key={label}>
                  <Icon />
                </a>
              ))}
            </div>

            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.33!2d73.6822!3d24.5854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDM1JzA3LjQiTiA3M8KwNDAnNTUuOSJF!5e0!3m2!1sen!2sin!4v161122334455!5m2!1sen!2sin"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                title="Mani Dental Clinic location map"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="appointment-form-box">
            <h3 className="form-title">Book an Appointment</h3>
            <p className="form-desc">
              Fill out the form below and we will get back to you shortly.
            </p>

            <form
              id="appointment-form"
              className="appointment-form"
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fname">First Name</label>
                  <input type="text" id="fname" name="firstName" required placeholder="Ex: Jane" />
                </div>
                <div className="form-group">
                  <label htmlFor="lname">Last Name</label>
                  <input type="text" id="lname" name="lastName" required placeholder="Ex: Doe" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input type="tel" id="phone" name="phone" required placeholder="+91" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" placeholder="jane@example.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input type="date" id="date" name="date" min={today} required />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Preferred Time</label>
                  <select id="time" name="time" required defaultValue="">
                    <option value="" disabled>
                      Select a time
                    </option>
                    {appointmentTimes.map((time) => (
                      <option value={time.value} key={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="service">Service Required</label>
                <select id="service" name="service" required defaultValue="">
                  <option value="" disabled>
                    Select a service
                  </option>
                  {serviceOptions.map((service) => (
                    <option value={service.value} key={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message / Chief Concern</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Briefly describe your dental concern..."
                />
              </div>

              <button type="submit" className="btn btn-teal-gradient" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Request Appointment'}
              </button>
              <p className="form-note">We'll confirm within 2 hours via SMS or call.</p>

              <div
                id="form-success"
                className={clsx('form-success', !showSuccess && 'hidden')}
                role="status"
                aria-live="polite"
              >
                <CheckCircleIcon />
                Successfully requested! We will be in touch shortly.
              </div>

              {errorMessage ? (
                <div className="form-error" role="alert">
                  {errorMessage}
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
