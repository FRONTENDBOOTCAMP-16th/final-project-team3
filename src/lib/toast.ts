// lib/toast.ts
import toast from 'react-hot-toast';

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: 'bottom-center',
    style: {
      fontWeight: '600',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    },
  });
};

export const showSuccessToast = (message: string, icon?: string) => {
  toast.success(message, {
    duration: 2000,
    position: 'bottom-center',
    style: {
      background: '#111',
      color: '#fff',
      fontWeight: '600',
      borderRadius: '12px',
      padding: '12px 20px',
    },
    icon: icon ?? '✅',
  });
};
