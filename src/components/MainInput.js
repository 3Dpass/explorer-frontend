const MainInput = ({ placeholder, type, value, onChange }) => {
  return (
    <input
      type={type}
      className="main-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default MainInput;
