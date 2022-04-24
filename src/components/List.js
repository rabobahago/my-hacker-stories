import styled from "styled-components";
import React from "react";
import Items from "./Items";
import { sortBy } from "lodash";
const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENT: (list) => sortBy(list, "num_comments").reverse(),
  POINT: (list) => sortBy(list, "points").reverse(),
};
const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState({ sortKey: "NONE", isReverse: false });
  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);
  return (
    <ul>
      <li style={{ display: "flex" }}>
        <span style={{ width: "40%" }}>
          <StyledButtonLarge type="button" onClick={() => handleSort("TITLE")}>
            SortBy Title
          </StyledButtonLarge>
        </span>
        <span style={{ width: "30%" }}>
          <StyledButtonLarge type="button" onClick={() => handleSort("AUTHOR")}>
            SortBy Author
          </StyledButtonLarge>
        </span>
        <span style={{ width: "10%" }}>
          <StyledButtonLarge
            type="button"
            onClick={() => handleSort("COMMENT")}
          >
            SortBy Comments
          </StyledButtonLarge>
        </span>
        <span style={{ width: "10%" }}>
          <StyledButtonLarge type="button" onClick={() => handleSort("POINT")}>
            SortBy Points
          </StyledButtonLarge>
        </span>
        <span style={{ width: "10%" }}>Actions</span>
      </li>
      {sortedList.map((item) => {
        return (
          <Items key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        );
      })}
    </ul>
  );
};
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
export default List;
