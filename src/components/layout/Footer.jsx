import { Instagram, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-maroon text-ivory">
      <div className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-8 py-11 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="font-display mb-2.5 text-2xl text-ivory">SILKWAVES</p>
          <p className="max-w-md text-ivory/75 leading-relaxed">
            Curated sarees for modern celebrations, crafted around texture, grace, and quiet luxury.
          </p>
        </div>
        <div className="grid content-start gap-3">
          <a className="inline-flex items-center gap-2.5 text-ivory/85" href="mailto:hello@silkwaves.example">
            <Mail size={18} /> hello@silkwaves.example
          </a>
          <a
            className="inline-flex items-center gap-2.5 text-ivory/85"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={18} /> Instagram
          </a>
          <span className="inline-flex items-center gap-2.5 text-ivory/85">
            <MapPin size={18} /> India
          </span>
        </div>
      </div>
    </footer>
  );
}
