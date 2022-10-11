const MainSearch = ({ placeholder, type, value, onChange, triggerSearch }) => {
  const submitSearch = (e) => {
    e.preventDefault();
    triggerSearch();
  };

  return (
    <form className="search-container" onSubmit={(e) => submitSearch(e)}>
      <input
        type={type}
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
};

export default MainSearch;
