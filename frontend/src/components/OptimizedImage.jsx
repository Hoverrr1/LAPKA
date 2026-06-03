import { useState } from 'react';
import {
  UNSPLASH_FALLBACK_IMAGE,
  buildUnsplashSrcSet,
  buildUnsplashUrl,
  getProductImageBase,
} from '../utils/unsplashImages';

const OptimizedImage = ({
  src,
  product,
  alt = '',
  variant = 'full',
  className = '',
  sizes = '(max-width: 768px) 100vw, 400px',
  fallbackSrc = UNSPLASH_FALLBACK_IMAGE,
  fetchPriority,
  onError,
  ...props
}) => {
  const [failed, setFailed] = useState(false);
  const source = failed ? fallbackSrc : (product ? getProductImageBase(product) : src);
  const safeSource = source || fallbackSrc;

  return (
    <img
      src={buildUnsplashUrl(safeSource, variant)}
      srcSet={buildUnsplashSrcSet(safeSource)}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
      fetchpriority={fetchPriority}
      onError={(event) => {
        if (!failed) setFailed(true);
        onError?.(event);
      }}
      className={className}
      {...props}
    />
  );
};

export default OptimizedImage;
