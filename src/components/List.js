import Items from "./Items";
const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => {
        return (
          <Items key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        );
      })}
    </ul>
  );
};
export default List;
