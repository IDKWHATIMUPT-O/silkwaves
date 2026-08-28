// The colour vocabulary for product tagging and the colour filter.
//
// Products store SLUGS only — never hex. Hex belongs here, to the design
// vocabulary: storing it per product would fragment the palette (three
// near-identical maroons become three unfilterable facets) and turn a palette
// tweak into a data migration. Swatches resolve slug -> hex at render time.
//
// NOTE: silkwaves-admin keeps a hand-synced copy of this list at
// src/constants/colors.js. Change one, change the other.

export const COLOR_VOCABULARY = [
  { slug: 'ivory', name: 'Ivory', hex: '#f3ecdf' },
  { slug: 'off-white', name: 'Off White', hex: '#faf7f2' },
  { slug: 'champagne', name: 'Champagne', hex: '#e8d9b8' },
  { slug: 'gold', name: 'Gold', hex: '#c9a24b' },
  { slug: 'bronze', name: 'Bronze', hex: '#8a6a2b' },
  { slug: 'silver', name: 'Silver', hex: '#c3c6cb' },
  { slug: 'saffron', name: 'Saffron', hex: '#e08a1e' },
  { slug: 'mustard', name: 'Mustard', hex: '#c8971f' },
  { slug: 'peach', name: 'Peach', hex: '#f0b79a' },
  { slug: 'coral', name: 'Coral', hex: '#e2735e' },
  { slug: 'rani-pink', name: 'Rani Pink', hex: '#c2185b' },
  { slug: 'old-rose', name: 'Old Rose', hex: '#b97b7b' },
  { slug: 'ruby-red', name: 'Ruby Red', hex: '#9b1b30' },
  { slug: 'maroon', name: 'Maroon', hex: '#7a1f2b' },
  { slug: 'emerald', name: 'Emerald', hex: '#1f6b4f' },
  { slug: 'olive', name: 'Olive', hex: '#6b6b3a' },
  { slug: 'teal', name: 'Peacock Teal', hex: '#12707d' },
  { slug: 'royal-blue', name: 'Royal Blue', hex: '#2547a0' },
  { slug: 'indigo', name: 'Indigo', hex: '#2b3a67' },
  { slug: 'lavender', name: 'Lavender', hex: '#b3a2cc' },
  { slug: 'purple', name: 'Purple', hex: '#5b2a6b' },
  { slug: 'charcoal', name: 'Charcoal', hex: '#3a3733' },
  { slug: 'black', name: 'Black', hex: '#201a15' },
];

export const COLOR_BY_SLUG = new Map(
  COLOR_VOCABULARY.map((color) => [color.slug, color]),
);

// Unknown slugs still render — a neutral chip carrying the raw string — so
// legacy or foreign data from the live API never disappears silently.
export function resolveColor(slug) {
  return (
    COLOR_BY_SLUG.get(slug) ?? {
      slug,
      name: String(slug).replace(/-/g, ' '),
      hex: null,
    }
  );
}
