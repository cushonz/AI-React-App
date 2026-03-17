function InputField({ label, type, value, id, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
        {label}
      </label>
      <input
        className="w-full bg-zinc-800/80 text-white placeholder-zinc-600 px-4 py-3 rounded-lg border border-zinc-700/60 focus:outline-none focus:border-green-500/60 focus:bg-zinc-800 transition-all duration-200 text-sm"
        type={type}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;
