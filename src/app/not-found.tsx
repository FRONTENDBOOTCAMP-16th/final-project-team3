import ErrorScreen from '@/components/error/ErrorScreen';

export default function NotFound() {
  return (
    <ErrorScreen
      variant="not-found"
      code="404"
      title="페이지를 찾을 수 없습니다"
      description="요청하신 페이지가 존재하지 않거나 이동되었습니다."
    />
  );
}
