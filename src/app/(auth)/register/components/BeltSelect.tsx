import { forwardRef } from 'react';
import { SPORTS } from '@/constants/sports';

const SportSelect = forwardRef<
  HTMLSelectElement,
  { id: string; value?: string } & React.SelectHTMLAttributes<HTMLSelectElement>
>(({ id, value, ...rest }, ref) => {
  const selectedSport = SPORTS.find((s) => s.slug === value);

  return (
    <div className="relative">
      {selectedSport && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base leading-none">
          {selectedSport.icon}
        </span>
      )}
      <select
        id={id}
        ref={ref}
        value={value}
        {...rest}
        className="w-full bg-input-bg border-none rounded-2xl py-4 pr-4 text-base text-text-secondary focus:ring-2 focus:ring-btn-focus outline-none transition-all appearance-none"
        style={{ paddingLeft: selectedSport ? '36px' : '16px' }}
      >
        <option value="">운동 종목을 선택하세요</option>
        {SPORTS.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.icon} {s.name}
          </option>
        ))}
      </select>
    </div>
  );
});
SportSelect.displayName = 'SportSelect';

export default SportSelect;
