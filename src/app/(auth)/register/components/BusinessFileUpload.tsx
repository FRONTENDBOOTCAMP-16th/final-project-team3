import { showErrorToast } from '@/lib/toast';

interface BusinessFileUploadProps {
  businessFile: File | null;
  onChange: (file: File | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function BusinessFileUpload({
  businessFile,
  onChange,
}: BusinessFileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file && file.size > MAX_FILE_SIZE) {
      showErrorToast('파일 용량은 5MB를 초과할 수 없습니다.');
      e.target.value = '';
      return;
    }
    onChange(file);
  };

  return (
    <div>
      <label
        htmlFor="resume"
        className="block text-sm font-medium text-text-primary mb-2"
      >
        사업자등록증 첨부 (이미지/PDF)
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => document.getElementById('resume')?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById('resume')?.click();
          }
        }}
        className={`flex flex-col items-center justify-center rounded-2xl py-6 cursor-pointer hover:opacity-80 transition-all border-2 border-dashed ${
          businessFile
            ? 'bg-green-50 border-green-400'
            : 'bg-input-bg border-transparent'
        }`}
      >
        {businessFile ? (
          <>
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-green-500 mb-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-600 font-medium">
              {businessFile.name}
            </span>
            <span className="text-xs text-green-400 mt-1">
              클릭하여 파일 변경
            </span>
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-text-secondary mb-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
            </svg>
            <span className="text-sm text-text-secondary">
              클릭하여 파일 업로드
            </span>
            <span className="text-xs text-text-secondary mt-1">
              JPG, PNG, GIF, PDF (최대 5MB)
            </span>
          </>
        )}
        <input
          id="resume"
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
