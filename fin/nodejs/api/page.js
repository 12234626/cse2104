const calcPage = function (puzzles, page) {
    const max_count_in_one_page = 5, max_page = Math.ceil(puzzles.length / max_count_in_one_page);

    return {
        "puzzles" : puzzles.slice(max_count_in_one_page * (page - 1), Math.min(puzzles.length, max_count_in_one_page * page)),
        "page" : page,
        "max_page" : max_page
    };
};

export {
    calcPage,
};
