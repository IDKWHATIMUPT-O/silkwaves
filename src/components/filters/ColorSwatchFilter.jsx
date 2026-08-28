import FilterChip from './FilterChip.jsx';

/**
 * Swatch plus a visible name, never colour alone — a dot on its own is
 * unusable to anyone who cannot distinguish it, and unknown slugs have no hex
 * at all, so they fall back to a neutral chip carrying the raw name.
 */
export default function ColorSwatchFilter({ colors, selected, onToggle }) {
  return (
    <>
      {colors.map((color) => (
        <FilterChip
          key={color.slug}
          selected={selected.includes(color.slug)}
          onSelect={() => onToggle(color.slug)}
          count={color.count}
        >
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/15"
            style={{
              backgroundColor: color.hex ?? 'transparent',
              backgroundImage: color.hex
                ? undefined
                : 'linear-gradient(135deg, var(--color-ivory-soft) 45%, var(--color-muted) 55%)',
            }}
          />
          {color.name}
        </FilterChip>
      ))}
    </>
  );
}
