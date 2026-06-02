import { FaBox, FaLeaf, FaLayerGroup, FaSpinner, FaTimesCircle } from 'react-icons/fa';

export const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-emerald-100';

export const Field = ({ label, hint, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</span>
    {children}
    {hint && <span className="mt-2 block text-xs text-slate-400">{hint}</span>}
  </label>
);

export const SelectField = ({ label, name, value, options, onChange, placeholder = 'Оберіть значення' }) => (
  <Field label={label}>
    <select name={name} value={value} onChange={onChange} className={inputClass}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>
          {typeof option === 'string' ? option : option.label}
        </option>
      ))}
    </select>
  </Field>
);

export const ToggleSwitch = ({ checked, onChange, label, description }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 transition hover:bg-emerald-50">
    <span>
      <span className="block text-sm font-bold text-slate-800">{label}</span>
      {description && <span className="mt-1 block text-xs text-slate-500">{description}</span>}
    </span>
    <span className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-primary' : 'bg-slate-300'}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </span>
  </label>
);

const statStyles = {
  products: { icon: FaBox, color: 'bg-blue-50 text-blue-600' },
  eco: { icon: FaLeaf, color: 'bg-emerald-50 text-emerald-600' },
  stock: { icon: FaTimesCircle, color: 'bg-rose-50 text-rose-600' },
  categories: { icon: FaLayerGroup, color: 'bg-amber-50 text-amber-600' },
};

export const StatCard = ({ title, value, type }) => {
  const { icon: Icon, color } = statStyles[type];
  return (
    <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-medium">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{value}</p>
        </div>
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}><Icon /></span>
      </div>
    </div>
  );
};

export const StockBadge = ({ stock }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
    {stock > 0 ? `В наявності: ${stock}` : 'Немає в наявності'}
  </span>
);

export const TableSkeleton = ({ columns = 5 }) => (
  <tbody>
    {Array.from({ length: 6 }).map((_, row) => (
      <tr key={row} className="border-b border-slate-100">
        {Array.from({ length: columns }).map((__, column) => (
          <td key={column} className="px-5 py-4"><div className="skeleton-loader h-5 w-full max-w-[9rem]" /></td>
        ))}
      </tr>
    ))}
  </tbody>
);

export const SubmitButton = ({ busy, editing }) => (
  <button type="submit" disabled={busy} className="btn-primary inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
    {busy ? <FaSpinner className="animate-spin" /> : null}
    {busy ? 'Збереження...' : editing ? 'Оновити товар' : 'Додати товар'}
  </button>
);
