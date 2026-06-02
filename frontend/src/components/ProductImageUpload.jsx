import { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaImage, FaSpinner } from 'react-icons/fa';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ProductImageUpload = ({ previewUrl, uploading, onSelectFile, onValidationError, onPreviewError }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const selectFile = (file) => {
    if (uploading) return;
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      onValidationError('Дозволені формати фото: JPG, JPEG, PNG або WEBP');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      onValidationError('Розмір фото не повинен перевищувати 5 MB');
      return;
    }
    onSelectFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Фото товару</p>
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-emerald-50 shadow-soft">
        {previewUrl ? (
          <img src={previewUrl} alt="Попередній перегляд товару" onError={onPreviewError} className="h-52 w-full object-cover" />
        ) : (
          <div className="grid h-52 place-items-center text-center text-emerald-700/50">
            <div>
              <FaImage className="mx-auto text-4xl" />
              <p className="mt-3 px-4 text-xs font-semibold">Попередній перегляд фото</p>
            </div>
          </div>
        )}
      </div>

      <div
        onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-4 text-center transition ${
          dragActive ? 'border-primary bg-emerald-50' : 'border-slate-200 bg-white/70 hover:border-emerald-300'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={(event) => {
            selectFile(event.target.files?.[0]);
            event.target.value = '';
          }}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2 text-primary">
            <FaSpinner className="animate-spin text-2xl" />
            <p className="text-sm font-bold">Фото завантажується...</p>
          </div>
        ) : (
          <>
            <FaCloudUploadAlt className="mx-auto text-3xl text-primary" />
            <p className="mt-2 text-sm font-bold text-slate-700">Виберіть фото товару</p>
            <p className="mt-1 text-xs text-slate-400">Перетягніть файл сюди або скористайтесь кнопкою. До 5 MB.</p>
            <button type="button" onClick={() => inputRef.current?.click()} className="mt-3 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-secondary">
              Вибрати фото
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductImageUpload;
