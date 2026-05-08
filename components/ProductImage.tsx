'use client';

export default function ProductImage({ src, alt, className }: {
  src: string;
  alt: string;
  className?: string;
}) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = '/placeholder-product.svg';
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}