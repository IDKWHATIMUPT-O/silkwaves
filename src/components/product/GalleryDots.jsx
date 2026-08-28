import cx from '../../utils/cx.js';

/**
 * Shared by the card and the modal, which carried near-identical copies.
 *
 * Interactive when onSelect is passed; purely decorative otherwise. On the card
 * the images advance on hover and the dots are only a progress hint, so
 * exposing them as controls there would add noise to the tab order for nothing.
 */
export default function GalleryDots({ count, activeIndex, onSelect, className = '' }) {
  if (!count || count < 2) return null;

  const dots = Array.from({ length: count });

  if (!onSelect) {
    return (
      <div aria-hidden="true" className={cx('flex justify-center gap-1.5', className)}>
        {dots.map((_, index) => (
          <span
            key={index}
            className={cx(
              'h-1.5 w-1.5 rounded-full transition-colors duration-200',
              index === activeIndex ? 'bg-ivory' : 'bg-ivory/50',
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cx('flex justify-center gap-2', className)}>
      {dots.map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Show image ${index + 1} of ${count}`}
          aria-current={index === activeIndex}
          className={cx(
            'h-2.5 w-2.5 rounded-full border transition-colors duration-200',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
            index === activeIndex
              ? 'border-ivory bg-ivory'
              : 'border-ivory/60 bg-ivory/30 hover:bg-ivory/60',
          )}
        />
      ))}
    </div>
  );
}
