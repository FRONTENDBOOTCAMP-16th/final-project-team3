import toast from 'react-hot-toast';

export const showErrorToast = (message: string) => {
  const isDark = document.documentElement.classList.contains('dark');
  toast.error(message, {
    position: 'bottom-center',
    style: {
      background: isDark ? '#e5e7eb' : '#111',
      color: isDark ? '#111' : '#fff',
      fontWeight: '600',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    },
  });
};

export const showSuccessToast = (message: string, icon?: string) => {
  const isDark = document.documentElement.classList.contains('dark');
  toast.success(message, {
    duration: 2000,
    position: 'bottom-center',
    style: {
      background: isDark ? '#e5e7eb' : '#111',
      color: isDark ? '#111' : '#fff',
      fontWeight: '600',
      borderRadius: '12px',
      padding: '12px 20px',
      minWidth: '300px',
      maxWidth: '400px',
      whiteSpace: 'nowrap',
    },
    icon: icon ?? '✅',
  });
};
