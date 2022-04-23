import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import List from "./List";
import SearchForm from "./SearchForm";
export const initialState = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];
//our Custom Hook
const reducerStories = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter((story) => {
          return action.payload.objectID !== story.objectID;
        }),
      };
    default:
      throw new Error();
  }
};
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
const useSemiPesistentHook = (key, initialState) => {
  const [searchValue, setSearchValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  useEffect(() => {
    localStorage.setItem(key, searchValue);
  }, [searchValue, key]);
  return [searchValue, setSearchValue];
};
// const getAsyncStories = () => {
//   return new Promise((resolve) =>
//     setTimeout(() => resolve({ data: { stories: initialState } }), 2000)
//   );
// };
const Main = () => {
  const [searchValue, setSearchValue] = useSemiPesistentHook("search", "react");
  // const [stories, setStories] = React.useState([]);
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchValue}`);
  const [stories, dispatchStories] = React.useReducer(reducerStories, {
    data: [],
    isLoading: false,
    isError: false,
  });
  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isError, setError] = React.useState(false);
  // useEffect(() => {
  //   localStorage.setItem("search", searchValue);
  // }, [searchValue]);
  const fetchData = React.useCallback(async () => {
    // if (searchValue === "") return;
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    // const {
    //   data: { stories },
    // } = await getAsyncStories();
    const result = await axios.get(url);
    // const result = await response.json();
    dispatchStories({
      type: "STORIES_FETCH_SUCCESS",
      payload: result.data.hits,
    });
    // setStories(stories);
    // setIsLoading(false);
  }, [url]);
  React.useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.error(error);
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [fetchData]);
  const handleRemoveItem = (item) => {
    // const filtedStories = stories.filter((story) => {
    //   return item.objectID !== story.objectID;
    // });
    dispatchStories({ type: "REMOVE_STORY", payload: item });
  };
  const handleSearchSubmit = (e) => {
    setUrl(`${API_ENDPOINT}${searchValue}`);
    e.preventDefault();
  };
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };
  const searchedStories = stories.data.filter((story) => {
    return story.title
      .toLocaleLowerCase()
      .includes(searchValue.toLocaleLowerCase());
  });
  return (
    <StyledContainer>
      {stories.isError && <p>Something went wrong</p>}
      {stories.isLoading ? (
        <h3>Loading.....</h3>
      ) : (
        <div>
          <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>
          <SearchForm
            onHandleSearch={handleSearch}
            onHandleSearchSubmit={handleSearchSubmit}
            searchValue={searchValue}
          />
          <List list={searchedStories} onRemoveItem={handleRemoveItem} />
        </div>
      )}
      {/* <ul>
        {searchStory.map(({ objectID, ...item }) => {
          return (
            <li key={objectID}>
              <Items {...item} />
            </li>
          );
        })}
      </ul> */}
    </StyledContainer>
  );
};
export default Main;
const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;
  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;
const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;
