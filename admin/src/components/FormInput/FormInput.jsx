export default function FormInput({ label, error, as = 'input', ...props }) {
  const Component = as;
  const id = props.id || props.name;
  return (
    <label className="admin-field" htmlFor={id}>
      <span>{label}</span>
      <Component id={id} {...props} aria-invalid={!!error} />
      {error && <small>{error}</small>}
    </label>
  );
}
