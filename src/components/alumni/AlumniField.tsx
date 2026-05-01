type InputProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  type?: string;
  required?: boolean;
};

export function AlumniInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
}: InputProps) {
  return (
    <label className="block">
      <p className="mb-2 text-sm text-white/85">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur-xl"
      />
    </label>
  );
}

export function AlumniTextarea({
  label,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <p className="mb-2 text-sm text-white/85">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur-xl"
      />
    </label>
  );
}

export function AlumniSelect({
  label,
  options,
  value,
  onChange,
  required,
}: {
  label: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (val: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <p className="mb-2 text-sm text-white/85">{label}</p>
      <select 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl"
      >
        <option value="" className="text-black">
          Pilih...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-black">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}