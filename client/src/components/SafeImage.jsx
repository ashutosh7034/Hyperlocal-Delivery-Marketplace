import React, { useState } from 'react';

const DEFAULT_PLACEHOLDERS = [
  'https://via.placeholder.com/800x450?text=No+Image',
  'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=800',
];

const SafeImage = ({ src, fallback, alt = '', className = '', ...props }) => {
  const fallbacks = Array.isArray(fallback) ? fallback : [fallback].filter(Boolean);
  const initial = src || fallbacks[0] || DEFAULT_PLACEHOLDERS[0];
  const [currentSrc, setCurrentSrc] = useState(initial);
  const [attempt, setAttempt] = useState(0);

  const handleError = () => {
    const next = fallbacks[attempt] || DEFAULT_PLACEHOLDERS[attempt] || DEFAULT_PLACEHOLDERS[0];
    if (next && next !== currentSrc) {
      setCurrentSrc(next);
      setAttempt(attempt + 1);
    } else if (currentSrc !== DEFAULT_PLACEHOLDERS[0]) {
      setCurrentSrc(DEFAULT_PLACEHOLDERS[0]);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeImage;
