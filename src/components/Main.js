import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import List from "./List";
import LastSearches from "./LastSearches";
import SearchForm from "./SearchForm";
import { Circles } from "react-loader-spinner";

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
        data: action.payload.list,
        page: action.payload.page,
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

// const getUrl = (searchTerm) => `${API_ENDPOINT}${searchTerm}`;
const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

const getUrl = (searchTerm, page) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

// const extractSearchTerm = (url) => url.replace(API_ENDPOINT, "");
// const extractSearchTerm = (url) =>
//   url.substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"));
const extractSearchTerm = (url) =>
  url
    .substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"))
    .replace(PARAM_SEARCH, "");
const getLastSearches = (urls) =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previousSearchTerm = result[result.length - 1];

      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1);
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
  // const [urls, setUrls] = React.useState([getUrl(searchValue)]);
  const [urls, setUrls] = React.useState([getUrl(searchValue, 0)]);
  const [stories, dispatchStories] = React.useReducer(reducerStories, {
    data: [],
    page: 0,
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
    const result = await axios.get(urls);
    // const result = await response.json();
    dispatchStories({
      type: "STORIES_FETCH_SUCCESS",
      payload: { list: result.data.hits, page: result.data.page },
    });
    // setStories(stories);
    // setIsLoading(false);
  }, [urls]);
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
    setUrls(`${API_ENDPOINT}${searchValue}`);
    handleSearch(searchValue, 0);
    e.preventDefault();
  };
  const handleSearchInput = (e) => {
    setSearchValue(e.target.value);
  };
  const searchedStories = stories.data.filter((story) => {
    return story.title
      .toLocaleLowerCase()
      .includes(searchValue.toLocaleLowerCase());
  });
  const handleLastSearch = (searchTerm) => {
    setSearchValue(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };

  const lastSearches = getLastSearches(urls);
  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchValue = extractSearchTerm(lastUrl);
    handleSearch(searchValue, stories.page + 1);
  };
  return (
    <StyledContainer>
      {stories.isError && <p>Something went wrong</p>}
      {stories.isLoading ? (
        // <h3>Loading.....</h3>
        <StyledLoader>
          <Circles color="#00BFFF" height={120} width={120} />
        </StyledLoader>
      ) : (
        <div>
          <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>
          <SearchForm
            onHandleSearch={handleSearchInput}
            onHandleSearchSubmit={handleSearchSubmit}
            searchValue={searchValue}
          />
          <LastSearches
            lastSearches={lastSearches}
            onLastSearch={handleLastSearch}
          />
          <List list={searchedStories} onRemoveItem={handleRemoveItem} />
          {/* <button type="button" onClick={handleMore}>
            More
          </button> */}
          <StyledButtonLarge type="button" onClick={handleMore}>
            More
          </StyledButtonLarge>
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
const StyledLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
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
