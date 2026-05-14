'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  confirmVariant?: 'default' | 'danger' | 'success' | 'warning';
}

const confirmButtonVariantClassMap: Record<
  NonNullable<ConfirmModalProps['confirmVariant']>,
  string
> = {
  default: 'bg-btn-focus text-btn-focus-text hover:opacity-80',
  danger: 'bg-danger text-btn-focus-text hover:opacity-80',
  success: 'bg-state-green-text text-white hover:opacity-80',
  warning: 'bg-state-yellow text-white hover:opacity-80',
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = '삭제',
  cancelLabel = '취소',
  disabled = false,
  confirmVariant = 'default',
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            disabled={disabled}
            className="flex-1 rounded-lg bg-btn-basic py-2 text-sm font-medium text-btn-text transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={disabled}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${confirmButtonVariantClassMap[confirmVariant]}`}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
