import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <section className="section-shell page not-found">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <Button to="/">Return home</Button>
    </section>
  );
}
