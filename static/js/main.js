async function main() {
    const tablesToSort = document.querySelectorAll('table[data-sort-table]');

    tablesToSort.forEach(table => new Tablesort(table));
}

window.onload = function() {
    main().then();
};
