import { forwardRef } from 'react';

const BELTS = [
  { value: 'white', label: 'White  (입문자)', color: '#e8e8e8' },
  { value: 'blue', label: 'Blue   (파란띠)', color: '#2e6fdb' },
  { value: 'purple', label: 'Purple (보라띠)', color: '#7c4ddb' },
  { value: 'brown', label: 'Brown  (갈색띠)', color: '#8b5a2b' },
  { value: 'black', label: 'Black  (검은띠)', color: '#1a1a1a' },
];

const BeltSelect = forwardRef<
  HTMLSelectElement,
  { id: string; value?: string } & React.SelectHTMLAttributes<HTMLSelectElement>
>(({ id, value, ...rest }, ref) => {
  const selectedColor = BELTS.find((b) => b.value === value)?.color;

  return (
    <div className="relative">
      {selectedColor && (
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{ backgroundColor: selectedColor }}
        />
      )}
      <select
        id={id}
        ref={ref}
        value={value}
        {...rest}
        className="w-full bg-input-bg border-none rounded-2xl py-4 pr-4 text-base text-text-secondary focus:ring-2 focus:ring-btn-focus outline-none transition-all appearance-none"
        style={{ paddingLeft: selectedColor ? '36px' : '16px' }}
      >
        <option value="">벨트를 선택하세요</option>
        {BELTS.map((b) => (
          <option key={b.value} value={b.value}>
            {b.label}
          </option>
        ))}
      </select>
    </div>
  );
});
BeltSelect.displayName = 'BeltSelect';

export default BeltSelect;
