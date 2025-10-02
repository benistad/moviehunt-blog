/**
 * Composant pour afficher la note d'un film avec les logos MovieHunt
 */
export default function MovieRating({ rating, size = 'md', className = '' }) {
  // Valider et normaliser la note (1-10)
  const normalizedRating = Math.min(Math.max(Math.round(rating), 1), 10);
  
  // Tailles disponibles
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
  };

  const sizeClass = sizes[size] || sizes.md;

  if (!rating || rating < 1 || rating > 10) {
    return null;
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={`/ratings/${normalizedRating}.png`}
        alt={`Note: ${normalizedRating}/10`}
        className={`${sizeClass} object-contain`}
        title={`Note MovieHunt: ${normalizedRating}/10`}
      />
    </div>
  );
}
