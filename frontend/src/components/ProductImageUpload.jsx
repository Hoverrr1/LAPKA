import { FaImage, FaLink } from 'react-icons/fa';
import OptimizedImage from './OptimizedImage';

const ProductImageUpload = ({ previewUrl }) => (
  <div className="space-y-3">
    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Фото товару</p>
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-emerald-50 shadow-soft">
      {previewUrl ? (
        <OptimizedImage
          src={previewUrl}
          alt="Попередній перегляд товару"
          variant="preview"
          className="h-52 w-full object-cover"
        />
      ) : (
        <div className="grid h-52 place-items-center text-center text-emerald-700/50">
          <div>
            <FaImage className="mx-auto text-4xl" />
            <p className="mt-3 px-4 text-xs font-semibold">Попередній перегляд фото</p>
          </div>
        </div>
      )}
    </div>

    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 p-4 text-center transition hover:border-emerald-300">
      <FaLink className="mx-auto text-3xl text-primary" />
      <p className="mt-2 text-sm font-bold text-slate-700">Фото з бібліотеки або fallback URL</p>
      <p className="mt-1 text-xs text-slate-400">
        Основний сценарій: виберіть фото з медіабібліотеки. Поле Image URL можна лишити як резервний варіант.
      </p>
    </div>
  </div>
);

export default ProductImageUpload;
