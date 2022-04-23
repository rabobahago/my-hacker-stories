import styled from "styled-components";
const InputWithLabel = ({
  id,
  onInputChange,
  type = "text",
  inputValue,
  isFocused,
  children,
}) => {
  return (
    <div>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
      <StyledInput
        id={id}
        type={type}
        onChange={onInputChange}
        value={inputValue}
        autoFocus={isFocused}
      />
      <p>I am searching {inputValue}</p>
    </div>
  );
};
export default InputWithLabel;
const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;
const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;
  font-size: 24px;
`;
