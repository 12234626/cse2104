const refineAuthor = function (text) {
    return text.replace(/[^a-zA-Z가-힣\s]/g, "").replace(/\s/g, "").substring(0, 10) || "익명";
};
const refinePassword = function (text) {
    return text.replace(/\s+/g, "");
}
function refineTitle(text) {
    return text.replace(/[^a-zA-Z가-힣0-9\s]/g, "").trim().replace(/\s+/g, " ").substring(0, 20).trim() || "제목 없음";
};

export {
    refineAuthor,
    refinePassword,
    refineTitle
};
