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
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
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
