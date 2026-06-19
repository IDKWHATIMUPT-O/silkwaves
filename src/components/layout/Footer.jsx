import { Instagram, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-shell footer__grid">
        <div>
          <p className="footer__brand">SILKWAVES</p>
          <p className="footer__text">
            Curated sarees for modern celebrations, crafted around texture, grace, and quiet luxury.
          </p>
        </div>
        <div className="footer__links">
          <a href="mailto:hello@silkwaves.example">
            <Mail size={18} /> hello@silkwaves.example
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <Instagram size={18} /> Instagram
          </a>
          <span>
            <MapPin size={18} /> India
          </span>
        </div>
      </div>
    </footer>
  );
}
