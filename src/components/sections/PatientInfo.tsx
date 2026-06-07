import clsx from 'clsx';
import { useState } from 'react';

import {
  educationTips,
  faqs,
  paymentOptions,
  preparationTips,
  technologies,
} from '@/data/siteContent';

import { SimpleCheckIcon } from '../icons/SvgIcons';
import { AccordionItem } from '../ui/AccordionItem';
import { DecorativeIcon } from '../ui/DecorativeIcon';

type PatientInfoTab = 'faq' | 'payment' | 'education' | 'prepare';

const tabs: Array<{ id: PatientInfoTab; label: string }> = [
  { id: 'faq', label: 'FAQ' },
  { id: 'payment', label: 'Payment Options' },
  { id: 'education', label: 'Education' },
  { id: 'prepare', label: 'Prepare' },
];

export function PatientInfo() {
  const [activeTab, setActiveTab] = useState<PatientInfoTab>('faq');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section className="patient-info" id="patient-info">
      <div className="container">
        <div className="info-heading">
          <h2 className="section-title text-white">
            Patient <span className="highlight">Information</span>
          </h2>
          <p className="section-subtitle text-light">
            Everything you need to know before your visit.
          </p>
        </div>

        <div className="info-container">
          <div className="info-left">
            <div className="tabs-container">
              <div className="tabs-header" role="tablist" aria-label="Patient information">
                {tabs.map((tab) => (
                  <button
                    className={clsx('tab-btn', activeTab === tab.id && 'active')}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tab-${tab.id}`}
                    id={`tab-button-${tab.id}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div
                className={clsx('tab-content', activeTab === 'faq' && 'active')}
                id="tab-faq"
                role="tabpanel"
                aria-labelledby="tab-button-faq"
              >
                <div className="accordion">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openFaqIndex === index}
                      onToggle={() =>
                        setOpenFaqIndex((current) => (current === index ? null : index))
                      }
                    />
                  ))}
                </div>
              </div>

              <div
                className={clsx('tab-content', activeTab === 'payment' && 'active')}
                id="tab-payment"
                role="tabpanel"
                aria-labelledby="tab-button-payment"
              >
                <div className="payment-grid">
                  {paymentOptions.map((option) => (
                    <div className="payment-card" key={option}>
                      {option}
                    </div>
                  ))}
                </div>
                <div className="payment-note">
                  <DecorativeIcon name="info" />
                  <p>
                    We offer flexible payment plans for extensive treatments. Please speak to our
                    front desk for customized financial arrangements.
                  </p>
                </div>
              </div>

              <div
                className={clsx('tab-content', activeTab === 'education' && 'active')}
                id="tab-education"
                role="tabpanel"
                aria-labelledby="tab-button-education"
              >
                <ul className="education-list">
                  {educationTips.map((tip) => (
                    <li key={tip.label}>
                      <strong>{tip.label}:</strong> {tip.text}
                    </li>
                  ))}
                </ul>
                <div className="education-links">
                  <a href="https://www.ada.org" target="_blank" rel="noopener noreferrer">
                    Read more on ADA.org {'\u2192'}
                  </a>
                  <a href="https://www.ida.org.in" target="_blank" rel="noopener noreferrer">
                    Read more on IDA India {'\u2192'}
                  </a>
                </div>
              </div>

              <div
                className={clsx('tab-content', activeTab === 'prepare' && 'active')}
                id="tab-prepare"
                role="tabpanel"
                aria-labelledby="tab-button-prepare"
              >
                <ul className="prepare-list">
                  {preparationTips.map((tip) => (
                    <li key={tip}>
                      <SimpleCheckIcon />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="info-right">
            <div className="tech-box">
              <h3 className="side-title">
                Our <span className="highlight">Technology</span>
              </h3>
              <div className="tech-grid">
                {technologies.map((technology) => (
                  <div className="tech-card" key={technology.label}>
                    <div className="tech-icon">{technology.icon}</div>
                    <span>{technology.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
