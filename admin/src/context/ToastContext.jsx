import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const notify = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((v) => [...v, { id, message, type }]);
    setTimeout(() => setToasts((v) => v.filter((t) => t.id !== id)), 4200);
  }, []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div className={`toast toast-${t.type}`} key={t.id}>
            {t.type === 'success' ? <CheckCircle2 /> : <XCircle />}
            <span>{t.message}</span>
            <button
              onClick={() => setToasts((v) => v.filter((x) => x.id !== t.id))}
              aria-label="Dismiss notification"
            >
              <X />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
