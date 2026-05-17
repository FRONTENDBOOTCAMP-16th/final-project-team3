export const categoryMap: Record<
  string,
  { label: string; badgeClass: string; dotColor: string }
> = {
  promo: {
    label: '도장',
    badgeClass: 'bg-blue-50 text-blue-600',
    dotColor: 'bg-[#155DFC]',
  },
  notice: {
    label: '공지',
    badgeClass: 'bg-red-50 text-red-600',
    dotColor: 'bg-[#e7000b]',
  },
  personal: {
    label: '일반',
    badgeClass: 'bg-gray-100 text-gray-600',
    dotColor: 'bg-[#364153]',
  },
};
