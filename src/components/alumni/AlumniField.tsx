type InputProps = {
  label: string;
  placeholder?: string;
  value?: string;
  type?: string;
};

export function AlumniInput({
  label,
  placeholder,
  value,
  type = "text",
}: InputProps) {
  return (
    <label className="block">
      <p className="mb-2 text-sm text-white/85">{label}</p>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur-xl"
      />
    </label>
  );
}

export function AlumniTextarea({
  label,
  placeholder,
  value,
}: {
  label: string;
  placeholder?: string;
  value?: string;
}) {
  return (
    <label className="block">
      <p className="mb-2 text-sm text-white/85">{label}</p>
      <textarea
        defaultValue={value}
        placeholder={placeholder}
        className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur-xl"
      />
    </label>
  );
}

export function AlumniSelect({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="block">
      <p className="mb-2 text-sm text-white/85">{label}</p>
      <select className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl">
        <option value="" className="text-black">
          Pilih...
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-black">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}