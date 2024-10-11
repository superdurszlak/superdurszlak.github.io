(function () {
  const pageNum = window.store.page || 1;

  if (pageNum > 1) {
    const redirect = `/?${searchPathWithPageNum(pageNum)}`;

    window.location.href = redirect;
  }

  function searchPathWithPageNum(pageNum) {
    var query = window.location.search.substring(1);
    var params = query
      .split("&")
      .filter((element) => element.includes("="))
      .filter((element) => !element.includes("page"));

    params.push(`page=${pageNum}`);

    return params.sort().join("&");
  }
})();
