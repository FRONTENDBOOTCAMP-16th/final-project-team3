type BadgeVariant =
  | 'gray'
  | 'blue'
  | 'purple'
  | 'red'
  | 'green'
  | 'yellow';

interface AdminBadgeProps {
  label: string;
  variant: BadgeVariant;
}

const baseStyle =
  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium';

const variantStyleMap: Record<BadgeVariant, string> = {
  gray: 'bg-gray-100 text-gray-800',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
};

export default function AdminBadge({ label, variant }: AdminBadgeProps) {
  return (
    <span className={`${baseStyle} ${variantStyleMap[variant]}`}>
      {label}
    </span>
  );
}