import styled from "styled-components";
import InputWithLabel from "./InputWithLabel";
const SearchForm = ({ onHandleSearch, onHandleSearchSubmit, searchValue }) => {
  return (
    <StyledSearchForm onSubmit={onHandleSearchSubmit}>
      <InputWithLabel
        id="search"
        isFocused
        onInputChange={onHandleSearch}
        inputValue={searchValue}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <StyledButtonLarge
        type="button"
        disabled={!searchValue}
        onClick={onHandleSearchSubmit}
      >
        submit
      </StyledButtonLarge>
    </StyledSearchForm>
  );
};
export default SearchForm;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;
  &:hover {
    background: #171212;
    color: #ffffff;
  }
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;
const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;
