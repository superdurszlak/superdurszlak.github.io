import { urlWithPageNum } from './url-with-page-num.js';

(function () {

  const pageNum = window.store.pagination.page || 1;

  if (pageNum > 1) {
    const redirect = urlWithPageNum(pageNum);

    window.location.href = redirect;
  }
})();
