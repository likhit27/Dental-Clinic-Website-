import clsx from 'clsx';
import { useState } from 'react';

import { navLinks } from '@/data/siteContent';

import { MenuIcon } from '../icons/SvgIcons';

interface NavbarProps {
  activeSection: string;
}

export function Navbar({ activeSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar" id="navbar">
      <div className="container nav-container">
        <a href="#home" className="nav-brand" onClick={closeMenu}>
          <span className="logo-text">Mani Dental Clinic</span>
        </a>

        <button
          className="mobile-menu-btn"
          id="mobile-menu-btn"
          type="button"
          aria-label="Toggle menu"
          aria-controls="nav-links"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <MenuIcon />
        </button>

        <nav className={clsx('nav-links', isMenuOpen && 'open')} id="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={clsx(
                'nav-link',
                activeSection === link.id && 'active',
                link.isButton && 'btn-nav',
              )}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
