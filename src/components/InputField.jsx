function InputField({ label, type, value, id, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-white">
        {label}
      </label>
      <input
        className="w-full bg-zinc-800 text-white placeholder-zinc-500 px-4 py-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-green-500 transition duration-200"
        type={type}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;
