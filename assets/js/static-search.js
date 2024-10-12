import { urlWithPageNum } from "./url-with-page-num.js";

(function () {
  function postList(results, store) {
    var listings = results
      .map((element) => {
        // Iterate over the results
        var item = store[element.ref];
        return item.html;
      })
      .join("");
    return listings;
  }

  function paginateResults(results, pagination) {
    const pageParam = parseInt(getQueryVariable("page")) || 1;
    const page = Math.min(pageParam, pagination.total_pages);
    const pageIndex = Math.max(page, 1) - 1;

    const per_page = pagination.per_page;
    const offset = pageIndex * per_page;
    const limit = offset + per_page;
    return {
      results: results.slice(offset, limit),
      page: page,
      previousPage: Math.max(page - 1, 1),
      nextPage: Math.min(page + 1, pagination.total_pages),
      lastPage: pagination.total_pages,
    };
  }

  function enablePaginationLinks(results) {
    const links = [
      {
        id: "first-page",
        url: urlWithPageNum(1),
        disabled: results.page <= 1,
      },
      {
        id: "previous-page",
        url: urlWithPageNum(results.previousPage),
        disabled: results.page <= results.previousPage,
      },
      {
        id: "next-page",
        url: urlWithPageNum(results.nextPage),
        disabled: results.page >= results.nextPage,
      },
      {
        id: "last-page",
        url: urlWithPageNum(results.lastPage),
        disabled: results.page >= results.lastPage,
      },
    ];

    links.forEach((element) => {
      const link = document.getElementById(element.id);
      link.href = element.url;
      link.setAttribute("data-disabled", element.disabled.toString());
    });

    const pagination = document.getElementById("pagination-js");
    pagination.style.visibility = "visible";
  }

  function noResults() {
    return "<li>No results found. Try a different search term.</li>";
  }

  function displaySearchResults(results, store) {
    var searchResults = document.getElementById("search-results");

    const pagination = store.pagination;

    if (results.length) {
      const paginatedResults = paginateResults(results, pagination);
      searchResults.innerHTML = postList(paginatedResults.results, store.posts);
      enablePaginationLinks(paginatedResults);
    } else {
      searchResults.innerHTML = noResults();
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var params = query.split("&");

    return (
      params
        .filter((param) => param.includes("="))
        .map((element) => {
          var pair = element.split("=");

          return {
            key: pair[0],
            value: decodeURIComponent(pair[1].replace(/\+/g, "%20")),
          };
        })
        .filter((element) => element.key === variable)
        .map((element) => element.value)[0] || ""
    );
  }

  var searchTerm = getQueryVariable("query");
  var allResults = Object.keys(window.store.posts).map((key) => {
    const post = window.store.posts[key];
    return {
      id: key,
      ref: key,
      title: post.title,
      tags: post.tags,
      author: post.author,
      category: post.category,
      content: post.content,
    };
  });

  if (!searchTerm) {
    return displaySearchResults(allResults, window.store);
  } else {
    document.getElementById("search-box").setAttribute("value", searchTerm);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var lunrIndex = lunr(function () {
      this.field("id");
      this.field("title", { boost: 10 });
      this.field("tags", { boost: 5 });
      this.field("author");
      this.field("category");
      this.field("content");
      this.field("meta");

      allResults.forEach((result) => this.add(result));
    });
    const results = lunrIndex.search(searchTerm); // Get lunr to perform a search
    displaySearchResults(results, window.store);
  }
})();
