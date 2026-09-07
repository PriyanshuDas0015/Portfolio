import { ArrowUp } from 'lucide-react';
import useScrollPosition from '../../hooks/useScrollPosition';
export default function ScrollToTop() {
  const position = useScrollPosition();
  return position > 650 ? (
    <a className="scroll-top icon-button" href="#home" aria-label="Scroll to top">
      <ArrowUp size={19} />
    </a>
  ) : null;
}
