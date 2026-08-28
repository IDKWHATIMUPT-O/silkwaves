// Joins conditional class names. Deliberately dumb: it does NOT resolve
// conflicting Tailwind utilities (cx('p-2', 'p-4') keeps both and the cascade
// decides). tailwind-merge is a separate dependency decision.
export default function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
