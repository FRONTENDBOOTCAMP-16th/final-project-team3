import ErrorScreen from '@/components/error/ErrorScreen';

export default function MainNotFound() {
  return (
    <ErrorScreen
      variant="not-found"
      code="404"
      title="페이지를 찾을 수 없습니다"
      description="요청하신 페이지가 존재하지 않거나 이동되었습니다."
      className="fixed inset-0 z-50 min-h-dvh w-screen"
    />
  );
}
