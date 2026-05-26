import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const RouteProgress = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
    const timeout = setTimeout(() => {
      setIsActive(false);
    }, 100);

    return () => {
      clearTimeout(timeout);
      setIsActive(false);
    };
  }, [location.pathname]);

  return (
    <div
      aria-hidden="true"
      className={`fixed left-0 top-0 z-[100] h-1 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.35)] transition-all duration-300 ${
        isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
      }`}
    />
  );
};
