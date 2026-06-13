import clsx from 'clsx';
import type { ChangeEvent, FocusEvent, FormEvent, PointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { appointmentTimes, clinicContact, contactCards, serviceOptions } from '@/data/siteContent';

import {
  CheckCircleIcon,
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
} from '../icons/SvgIcons';
import { SectionHeader } from '../ui/SectionHeader';

const socialLinks = [
  {
    label: 'Review Mani Dental Clinic on Google',
    href: 'https://g.page/r/Cd6y_vygff6JEA0',
    icon: GoogleIcon,
  },
  {
    label: 'Mani Dental Clinic on Facebook',
    href: 'https://www.facebook.com/Mani-Dental-Clinic-802996813219563',
    icon: FacebookIcon,
  },
  {
    label: 'Mani Dental Clinic on Instagram',
    href: 'https://www.instagram.com/dentalmani/',
    icon: InstagramIcon,
  },
];

interface AppointmentPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  message: string;
}

type FieldName = keyof AppointmentPayload;
type FieldErrors = Partial<Record<FieldName, string>>;

const fieldOrder: FieldName[] = [
  'firstName',
  'lastName',
  'phone',
  'email',
  'date',
  'time',
  'service',
  'message',
];

const namePattern = /^[\p{L}][\p{L} .'-]*$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxMessageLength = 600;

function getIndianMobileDigits(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }

  return digits;
}

function formatIndianMobile(phone: string) {
  const mobileDigits = getIndianMobileDigits(phone);

  if (!/^[6-9]\d{9}$/.test(mobileDigits)) {
    return phone.trim();
  }

  return `+91 ${mobileDigits.slice(0, 5)} ${mobileDigits.slice(5)}`;
}

function isValidDateValue(dateValue: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return false;
  }

  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function getAppointmentPayload(formData: FormData): AppointmentPayload {
  return {
    firstName: String(formData.get('firstName') ?? '').trim(),
    lastName: String(formData.get('lastName') ?? '').trim(),
    phone: formatIndianMobile(String(formData.get('phone') ?? '')),
    email: String(formData.get('email') ?? '').trim(),
    date: String(formData.get('date') ?? ''),
    time: String(formData.get('time') ?? ''),
    service: String(formData.get('service') ?? ''),
    message: String(formData.get('message') ?? '').trim(),
  };
}

function validateAppointmentPayload(
  payload: AppointmentPayload,
  today: string,
  validTimes: Set<string>,
  validServices: Set<string>,
) {
  const errors: FieldErrors = {};
  const phoneDigits = getIndianMobileDigits(payload.phone);

  if (!payload.firstName) {
    errors.firstName = 'First name is required.';
  } else if (payload.firstName.length < 2 || !namePattern.test(payload.firstName)) {
    errors.firstName = 'Please enter a valid first name.';
  }

  if (!payload.lastName) {
    errors.lastName = 'Last name is required.';
  } else if (payload.lastName.length < 2 || !namePattern.test(payload.lastName)) {
    errors.lastName = 'Please enter a valid last name.';
  }

  if (!payload.phone) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
  }

  if (payload.email && !emailPattern.test(payload.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!payload.date) {
    errors.date = 'Preferred date is required.';
  } else if (!isValidDateValue(payload.date)) {
    errors.date = 'Please choose a valid date.';
  } else if (payload.date < today) {
    errors.date = 'Please choose today or a future date.';
  }

  if (!payload.time) {
    errors.time = 'Preferred time is required.';
  } else if (!validTimes.has(payload.time)) {
    errors.time = 'Please choose a valid appointment time.';
  }

  if (!payload.service) {
    errors.service = 'Service is required.';
  } else if (!validServices.has(payload.service)) {
    errors.service = 'Please choose a valid service.';
  }

  if (payload.message.length > maxMessageLength) {
    errors.message = `Please keep the message under ${maxMessageLength} characters.`;
  }

  return errors;
}

export function Appointment() {
  const formRef = useRef<HTMLFormElement>(null);
  const successTimerRef = useRef<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const validTimes = useMemo(() => new Set(appointmentTimes.map((time) => time.value)), []);
  const validServices = useMemo(
    () => new Set(serviceOptions.map((service) => service.value)),
    [],
  );

  const keepDatePickerInView = (
    event: FocusEvent<HTMLInputElement> | PointerEvent<HTMLInputElement>,
  ) => {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      return;
    }

    const field = event.currentTarget;

    window.requestAnimationFrame(() => {
      field.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth',
      });
    });
  };

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const fieldName = event.currentTarget.name as FieldName;

    if (fieldErrors[fieldName]) {
      setFieldErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[fieldName];
        return nextErrors;
      });
    }

    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const getFieldErrorId = (fieldName: FieldName) => `${fieldName}-error`;

  const getFieldAccessibility = (fieldName: FieldName) => ({
    'aria-invalid': Boolean(fieldErrors[fieldName]),
    'aria-describedby': fieldErrors[fieldName] ? getFieldErrorId(fieldName) : undefined,
  });

  const renderFieldError = (fieldName: FieldName) =>
    fieldErrors[fieldName] ? (
      <p className="field-error" id={getFieldErrorId(fieldName)}>
        {fieldErrors[fieldName]}
      </p>
    ) : null;

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
    setFieldErrors({});

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }

    const form = event.currentTarget;
    const payload = getAppointmentPayload(new FormData(form));
    const validationErrors = validateAppointmentPayload(payload, today, validTimes, validServices);
    const firstInvalidField = fieldOrder.find((fieldName) => validationErrors[fieldName]);

    if (firstInvalidField) {
      setFieldErrors(validationErrors);
      setErrorMessage('Please correct the highlighted fields.');

      const field = form.elements.namedItem(firstInvalidField);

      if (field instanceof HTMLElement) {
        field.focus();
      }

      return;
    }

    setIsSubmitting(true);

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
                <a
                  href={href}
                  aria-label={label}
                  key={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>

            <div className="map-container">
              <iframe
                src={clinicContact.mapEmbedUrl}
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
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fname">First Name *</label>
                  <input
                    type="text"
                    id="fname"
                    name="firstName"
                    required
                    maxLength={80}
                    autoComplete="given-name"
                    placeholder="Ex: Jane"
                    onChange={handleFieldChange}
                    {...getFieldAccessibility('firstName')}
                  />
                  {renderFieldError('firstName')}
                </div>
                <div className="form-group">
                  <label htmlFor="lname">Last Name *</label>
                  <input
                    type="text"
                    id="lname"
                    name="lastName"
                    required
                    maxLength={80}
                    autoComplete="family-name"
                    placeholder="Ex: Doe"
                    onChange={handleFieldChange}
                    {...getFieldAccessibility('lastName')}
                  />
                  {renderFieldError('lastName')}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    maxLength={18}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91 99833 99913"
                    onChange={handleFieldChange}
                    {...getFieldAccessibility('phone')}
                  />
                  {renderFieldError('phone')}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    maxLength={120}
                    autoComplete="email"
                    placeholder="jane@example.com"
                    onChange={handleFieldChange}
                    {...getFieldAccessibility('email')}
                  />
                  {renderFieldError('email')}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Preferred Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={today}
                    required
                    onChange={handleFieldChange}
                    onFocus={keepDatePickerInView}
                    onPointerDown={keepDatePickerInView}
                    {...getFieldAccessibility('date')}
                  />
                  {renderFieldError('date')}
                </div>
                <div className="form-group">
                  <label htmlFor="time">Preferred Time *</label>
                  <select
                    id="time"
                    name="time"
                    required
                    defaultValue=""
                    onChange={handleFieldChange}
                    {...getFieldAccessibility('time')}
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    {appointmentTimes.map((time) => (
                      <option value={time.value} key={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                  {renderFieldError('time')}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="service">Service Required *</label>
                <select
                  id="service"
                  name="service"
                  required
                  defaultValue=""
                  onChange={handleFieldChange}
                  {...getFieldAccessibility('service')}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {serviceOptions.map((service) => (
                    <option value={service.value} key={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
                {renderFieldError('service')}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message / Chief Concern</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={maxMessageLength}
                  placeholder="Briefly describe your dental concern..."
                  onChange={handleFieldChange}
                  {...getFieldAccessibility('message')}
                />
                {renderFieldError('message')}
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
