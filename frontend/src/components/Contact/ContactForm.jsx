import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, LoaderCircle } from 'lucide-react';
import { sendContact } from '../../services/contactApi';
const initial = { name: '', email: '', message: '' };
function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter at least 2 characters.';
  if (values.name.length > 80) errors.name = 'Please use 80 characters or fewer.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Please enter a valid email address.';
  if (values.message.trim().length < 10) errors.message = 'Please write at least 10 characters.';
  if (values.message.length > 5000) errors.message = 'Please use 5,000 characters or fewer.';
  return errors;
}
export default function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const locked = useRef(false);
  const form = useRef(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const submit = async (event) => {
    event.preventDefault();
    if (locked.current) return;
    const validation = validate(values);
    setErrors(validation);
    setFeedback('');
    if (Object.keys(validation).length) {
      setStatus('idle');
      form.current.elements[Object.keys(validation)[0]].focus();
      return;
    }
    locked.current = true;
    setStatus('sending');
    try {
      await sendContact(values);
      setStatus('success');
      setFeedback('Message sent successfully! Thank you for reaching out.');
      setValues(initial);
      timer.current = setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setFeedback(error.message);
      setErrors(error.fields || {});
    } finally {
      locked.current = false;
    }
  };
  const change = (event) => {
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setErrors((previous) => ({ ...previous, [event.target.name]: undefined }));
  };
  return (
    <form
      ref={form}
      className="contact-form glass"
      onSubmit={submit}
      noValidate
      aria-busy={status === 'sending'}
    >
      <div className="form-row">
        {[
          ['name', 'Your name', 'Name', 'text'],
          ['email', 'Your email', 'you@example.com', 'email'],
        ].map(([name, label, placeholder, type]) => (
          <div className="field" key={name}>
            <label htmlFor={`contact-${name}`}>{label}</label>
            <input
              id={`contact-${name}`}
              name={name}
              type={type}
              placeholder={placeholder}
              autoComplete={name}
              maxLength={name === 'name' ? 80 : 254}
              value={values[name]}
              onChange={change}
              disabled={status === 'sending'}
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
              required
            />
            {errors[name] && (
              <span className="field-error" id={`${name}-error`}>
                {errors[name]}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="field">
        <label htmlFor="contact-message">Your message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell me a little about your idea..."
          value={values.message}
          onChange={change}
          disabled={status === 'sending'}
          maxLength={5000}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <span className="field-error" id="message-error">
            {errors.message}
          </span>
        )}
      </div>
      <button
        className="button button-primary send-button"
        disabled={status === 'sending' || status === 'success'}
      >
        {status === 'sending' ? (
          <>
            Sending... <LoaderCircle className="loading-spinner" />
          </>
        ) : status === 'success' ? (
          <>
            Message Sent <Check />
          </>
        ) : (
          <>
            Send Message <ArrowUpRight />
          </>
        )}
      </button>
      <p className="form-privacy">Your details are used only to respond to your message.</p>
      <div
        className={`form-feedback feedback-${status}`}
        role={status === 'error' ? 'alert' : 'status'}
        aria-live="polite"
      >
        {feedback}
      </div>
    </form>
  );
}
