import InputWithLabel from "./InputWithLabel";
const SearchForm = ({ onHandleSearch, onHandleSearchSubmit, searchValue }) => {
  return (
    <form onSubmit={onHandleSearchSubmit}>
      <InputWithLabel
        id="search"
        isFocused
        onInputChange={onHandleSearch}
        inputValue={searchValue}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button
        type="button"
        disabled={!searchValue}
        onClick={onHandleSearchSubmit}
      >
        submit
      </button>
    </form>
  );
};
export default SearchForm;
