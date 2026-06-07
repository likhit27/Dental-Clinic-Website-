import clsx from 'clsx';

import { clinicContact } from '@/data/siteContent';

interface FloatingCtasProps {
  activeSection: string;
}

export function FloatingCtas({ activeSection }: FloatingCtasProps) {
  return (
    <div className={clsx('floating-ctas', activeSection === 'home' && 'floating-ctas-home')}>
      <a
        href={clinicContact.whatsappUrl}
        className="btn-float btn-float-call"
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="btn-float-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.32 1.8.6 2.65a2 2 0 0 1-.45 2.11L8 9.74a16 16 0 0 0 6.26 6.26l1.26-1.26a2 2 0 0 1 2.11-.45c.85.28 1.74.48 2.65.6A2 2 0 0 1 22 16.92Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </span>
        <span className="btn-float-label">Call Now</span>
      </a>
    </div>
  );
}
