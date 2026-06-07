import { footerServiceLinks, quickLinks } from '@/data/siteContent';

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-col branding">
            <h3 className="footer-logo">Mani Dental Clinic</h3>
            <p className="footer-tagline">Premium dental care in Udaipur. Your smile is our passion.</p>
            <p className="footer-desc">
              Led by Dr. Yogesh Trivedi, BDS, we specialize in cosmetic, implant, and general dentistry
              delivered with compassion and ethics.
            </p>
          </div>

          <div className="footer-col links">
            <h4>Our Services</h4>
            <ul>
              {footerServiceLinks.map((service) => (
                <li key={service}>
                  <a href="#services">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col links">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col hours">
            <h4>Clinic Hours</h4>
            <ul className="hours-list">
              <li>
                <span>Monday - Saturday:</span> <span>10:00 AM - 8:00 PM</span>
              </li>
              <li className="highlight-day">
                <span>Sunday:</span> <span>Closed</span>
              </li>
            </ul>
            <p className="footer-note">
              {'\u{1F4C5}'} Please book a prior appointment to avoid inconvenience. Walk-ins subject to
              availability.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-flex">
          <p>&copy; 2026 Mani Dental Clinic. All Rights Reserved.</p>
          <div className="bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
