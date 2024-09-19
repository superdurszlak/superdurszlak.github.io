(function () {
  const data = JSON.parse(document.getElementById('post-tags').textContent);
  const basePost = data.ref;
  const postTags = data.tags;


  var allResults = Object.keys(window.store).map((key) => {
    return {
      ref: key,
      tags: window.store[key].tags,
      html: window.store[key].html
    };
  });

  function findPostsByTag(tag) {

  }
  // You can place any logic here
})();
