import { ArrowDown } from 'lucide-react';

export default function ScrollIndicator() {
  return (
    <a className="hero-scroll" href="#about" aria-label="Scroll down to About">
      <span>Scroll Down</span>
      <i>
        <ArrowDown />
      </i>
    </a>
  );
}
