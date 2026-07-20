import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[68vh] w-[min(1160px,calc(100%-32px))] place-content-center justify-items-center py-14 text-center">
      <span className="text-xs font-extrabold uppercase tracking-widest text-maroon">404</span>
      <h1 className="my-4 text-[clamp(2rem,5vw,3.7rem)] font-semibold">Page not found</h1>
      <Button to="/">Return home</Button>
    </section>
  );
}
