import { onSelectAll, } from "../components/Common/TableCommonFunc";

function CustomPagination({ pageCount, currentPage, handlePageChange, tablelist }) {
    if (tablelist.length > 0) {
        let isAllcheck = tablelist.filter(i => (i.hasAllSelect))
        if (isAllcheck.length > 0) {
            onSelectAll({ event: true, allarray: tablelist });
        }
    }

    const pages = [];
    const maxVisiblePages = 5; // Total number of visible pagination items

    const getPageNumbers = () => {
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, pageCount);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const visiblePages = getPageNumbers();

    // Render start arrow
    if (currentPage > 1) {
        const startItem = (
            <li key="start" onClick={() => handlePageChange(1)}>
                <samp >  &laquo;&laquo;</samp>
            </li>
        );
        pages.push(startItem);
    }

    // Render previous arrow
    if (currentPage > 1) {
        const previousPage = currentPage - 1;
        const previousItem = (
            <li key="previous" onClick={() => handlePageChange(previousPage)}>
                <samp>&laquo;</samp>
            </li>
        );
        pages.push(previousItem);
    }

    // Render page numbers
    for (let i = 0; i < visiblePages.length; i++) {
        const pageNumber = visiblePages[i];
        const isActive = pageNumber === currentPage;

        const pageItem = (
            <li
                key={pageNumber}
                className={isActive ? "active" : ""}
                onClick={() => handlePageChange(pageNumber)}
            >
                {pageNumber}
            </li>
        );

        pages.push(pageItem);
    }

    // Render next arrow
    if (currentPage < pageCount) {
        const nextPage = currentPage + 1;
        const nextItem = (
            <li key="next" onClick={() => handlePageChange(nextPage)}>
                &raquo;
            </li>
        );
        pages.push(nextItem);
    }

    // Render end arrow
    if (currentPage < pageCount) {
        const endItem = (
            <li key="end" onClick={() => handlePageChange(pageCount)}>
                &raquo;&raquo;
            </li>
        );
        pages.push(endItem);
    }

    return <ul id='c__pagination'>{pages}</ul>;
}

export default CustomPagination

