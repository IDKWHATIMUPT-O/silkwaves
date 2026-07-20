import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { requestOtp, verifyOtp } from '../services/customerAuth.js';

const inputClasses =
  'min-h-12 w-full rounded-md border border-line bg-ivory px-4 text-ink placeholder:text-muted focus:border-maroon focus:outline-none';

export default function Login() {
  const navigate = useNavigate();

  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [emailHint, setEmailHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRequestOtp(event) {
    event.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      const data = await requestOtp({ phone, email });
      setEmailHint(data.emailHint);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({ phone, otp });
      navigate('/my-orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-[min(480px,calc(100%-32px))] py-14 md:py-20">
      <span className="text-xs font-extrabold uppercase tracking-widest text-maroon">Account</span>
      <h1 className="mt-2 mb-8 text-[clamp(2rem,5vw,2.6rem)] font-semibold">
        {step === 'phone' ? 'Log in to your account' : 'Enter your code'}
      </h1>

      {step === 'phone' ? (
        <form className="grid gap-4" onSubmit={handleRequestOtp}>
          <label className="grid gap-1.5 text-sm font-semibold text-muted">
            Phone number
            <input
              className={inputClasses}
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-muted">
            Email <span className="font-normal text-muted/70">(only needed the first time)</span>
            <input
              className={inputClasses}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          {error && <p className="m-0 text-sm font-semibold text-red-700">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Sending code...' : 'Send Code'}
          </Button>
        </form>
      ) : (
        <form className="grid gap-4" onSubmit={handleVerifyOtp}>
          <p className="m-0 text-sm text-muted">
            We sent a 6-digit code to <strong>{emailHint}</strong>.
          </p>

          <label className="grid gap-1.5 text-sm font-semibold text-muted">
            Verification code
            <input
              className={`${inputClasses} tracking-[0.3em]`}
              placeholder="000000"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </label>

          {error && <p className="m-0 text-sm font-semibold text-red-700">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? 'Verifying...' : 'Verify & Log In'}
          </Button>

          <button
            type="button"
            className="text-sm font-semibold text-maroon underline-offset-2 hover:underline"
            onClick={() => {
              setStep('phone');
              setOtp('');
              setError('');
            }}
          >
            Use a different number
          </button>
        </form>
      )}
    </section>
  );
}
