(function () {
  const data = window.store.current || {};
  const basePost = data.ref || "";
  const postTags = data.tags || [];

  const relatedPosts = allResults()
    .filter((result) => {
      return basePost != result.ref;
    })
    .filter((result) => {
      return matchesByTags(result.tags, postTags);
    })
    .map((result) => {
      return result.html;
    });


  const relatedPostsUl = document.getElementById('related-posts');
  
  relatedPostsUl.innerHTML = shuffleResults(relatedPosts)
    .slice(0, 3)
    .join("");

  enableRelatedPosts();

  function enableRelatedPosts() {
    document.getElementById('related-posts-wrapper').style['display'] = 'block';
  }

  function matchesByTags(foundTags, relevantTags) {
    const relevantTagsSet = new Set(relevantTags);
    return foundTags.some((tag) => {
      return relevantTagsSet.has(tag);
    });
  }

  function allResults() {
    const posts = window.store.posts;
    return Object.keys(posts).map((key) => {
      return {
        ref: key,
        tags: posts[key].tags,
        html: posts[key].html,
      };
    });
  }

  function shuffleResults(results) {
    const copy = [...results];
    for (let index = copy.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }
})();
