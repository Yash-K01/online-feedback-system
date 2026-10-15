export default function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className="stars" role={readOnly ? 'img' : 'radiogroup'} aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= value ? 'star on' : 'star'}
          onClick={() => !readOnly && onChange(n)}
          disabled={readOnly}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
