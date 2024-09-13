(function () {
  function heading(text) {
    return `<h2 class="post-list-heading">${text}</h2>`;
  }

  function postListing(item) {
    const sep = " ";
    const excerpt = item.content.split(sep)
      .slice(0, 40)
      .join(sep)
    return `
      <li class="post-listing">
        <h3>
          <a class="post-link" href="${item.url}">
            ${item.title}
          </a>
        </h3>
        ${item.postMeta}
        <div class="post-excerpt">
          <span>Excerpt: </span><p>${excerpt}</p>
        </div>
        ${item.tagsMeta}
      </li>
    `;
  }

  function postList(results, store) {
    var listings = results
      .map((element) => {
        // Iterate over the results
        var item = store[element.ref];
        return postListing(item);
      })
      .join("");
    return `
      <ul class="post-list">
      ${listings}
      </ul>
    `;
  }

  function displaySearchResults(results, store) {
    var searchResults = document.getElementById("search-results");

    if (results.length) {
      searchResults.innerHTML = `
        ${heading("Posts")}
        ${postList(results, store)}
      `;
    } else {
      searchResults.innerHTML = heading("No search results");
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var params = query.split("&");

    return params.filter((param) => param.includes("="))
      .map((element) => {
        var pair = element.split("=");

        return {
          key: pair[0],
          value: decodeURIComponent(pair[1].replace(/\+/g, "%20")),
        };
      })
      .filter((element) => element.key === variable)
      .map((element) => element.value)[0] || "";
  }

  var searchTerm = getQueryVariable("query");
  var allResults = Object.keys(window.store).map((key) => {
    return {
      id: key,
      ref: key,
      title: window.store[key].title,
      tags: window.store[key].tags,
      author: window.store[key].author,
      category: window.store[key].category,
      content: window.store[key].content,
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
    results = lunrIndex.search(searchTerm); // Get lunr to perform a search
    displaySearchResults(results, window.store);
  }
})();
