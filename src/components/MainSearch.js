const MainSearch = ({ placeholder, type, value, onChange, triggerSearch }) => {
  return (
    <div className="search-container">
      <input
        type={type}
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="search-btn" onClick={() => triggerSearch()}>
        Search
      </div>
    </div>
  );
};

export default MainSearch;
