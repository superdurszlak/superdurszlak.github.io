export function urlWithPageNum(pageNum) {
  var query = window.location.search.substring(1);
  var params = query
    .split("&")
    .filter((element) => element.includes("="))
    .filter((element) => !element.includes("page"));

  params.push(`page=${pageNum}`);

  const newQuery = params.sort().join("&");
  const baseUrl = window.store.pagination.baseUrl || "/";
  return `${baseUrl}?${newQuery}`;
}
