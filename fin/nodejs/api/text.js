const filterAuthor = function (text) {
    return text.replace(/[^a-zA-Z가-힣\s]/g, "").replace(/\s/g, "").substring(0, 10) || "익명";
};
const filterPassword = function (text) {
    return text.replace(/\s+/g, "");
}
function filterTitle(text) {
    return text.replace(/[^a-zA-Z가-힣0-9\s]/g, "").trim().replace(/\s+/g, " ").substring(0, 20).trim() || "제목 없음";
};

export {
    filterAuthor,
    filterPassword,
    filterTitle
};
