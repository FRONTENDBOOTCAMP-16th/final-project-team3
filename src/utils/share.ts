import { showSuccessToast, showErrorToast } from '@/lib/toast';

export async function handleShare() {
  const url = window.location.href;

  if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
    try {
      await navigator.share({ url });
    } catch {
      // 취소 무시
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      showSuccessToast('링크가 복사되었습니다!', '🔗');
    } catch {
      showErrorToast('복사에 실패했습니다.');
    }
  }
}
