const form = $("form"), input_select = form.find(".input_select");
const color_preview_left = $("#color_preview_left"), color_preview_right = $("#color_preview_right");
const table_container = $("#table_container"), table_clue_row = table_container.find("#clue_row"), table_clue_col = table_container.find("#clue_col"), table_cross = table_container.find("#cross");
const hl = $(".hl"), hl_row = $("#hl_row"), hl_col = $("#hl_col");

const puzzle = {}, clue = [], max_clue_size = [], table = [];
const cell_size = 20;
let select_mode = input_select.filter("[checked=checked]").val(), color = 3, color_left = 3, color_right = 3;

Object.assign(puzzle, JSON.parse(table_container.attr("data-puzzle")));
Object.assign(clue, puzzle["clue"]);
Object.assign(max_clue_size, puzzle["max_clue_size"]);
Object.assign(table, Array.from(Array(200), () => new Array(200).fill(0)));
table_container.removeAttr("data-puzzle");

hl_row.css({
    "width" : `${cell_size * (clue[1] + max_clue_size[0])}px`,
    "height" : `${cell_size}px`
});
hl_col.css({
    "width" : `${cell_size}px`,
    "height" : `${cell_size * (clue[0] + max_clue_size[1])}px`
});
table_clue_row.css({"grid-template" : `repeat(${clue[0]}, auto) / repeat(${puzzle["max_clue_size"][0]}, auto)`});
table_clue_col.css({"grid-template" : `repeat(${puzzle["max_clue_size"][1]}, auto) / repeat(${clue[1]}, auto)`});
table_cross.css({"grid-template" : `repeat(${clue[0]}, auto) / repeat(${clue[1]}, auto)`});
table_container.css({
    "display" : "grid"
});
table_container.find(".cell").css({
    "width" : `${cell_size}px`,
    "height" : `${cell_size}px`
});
for (let k = 2; k < clue.length;) {
    for (let i = 0; i < clue[0]; ++i, k += clue[k] + 1) for (let j = 0; j < clue[k]; ++j) {
        table_clue_row.find(`#clue_row_cell_${i}_${j + puzzle["max_clue_size"][0] - clue[k]}`)
        .addClass("white")
        .text(clue[j + k + 1]);
    }
    for (let j = 0; j < clue[1]; ++j, k += clue[k] + 1) for (let i = 0; i < clue[k]; ++i) {
        table_clue_col.find(`#clue_col_cell_${i + puzzle["max_clue_size"][1] - clue[k]}_${j}`)
        .addClass("white")
        .text(clue[i + k + 1]);
    }
}

const recolor = function (e, color) {
    e.removeClass("black white");
    if (color === 2) e.addClass("black");
    else if (color === 1) e.addClass("white");
}
const changeClick = function (select_mode, target) {
    if (select_mode === "select") {
        color_left = target.hasClass("black") ? 0 : 2;
        color_right = target.hasClass("white") ? 0 : 1;
    } else if (select_mode === "always") {
        color_left = 2;
        color_right = 1;
    } else if (select_mode === "cycle") {
        color_left = target.hasClass("black") ? 1 : target.hasClass("white") ? 0 : 2;
        color_right = target.hasClass("black") ? 0 : target.hasClass("white") ? 2 : 1;
    } else if (select_mode === "cycle_bw") {
        color_left = target.hasClass("black") ? 1 : 2;
        color_right = target.hasClass("black") ? 1 : 2;
    }
    recolor(color_preview_left, color_left);
    recolor(color_preview_right, color_right);
}

input_select.change(function () {
    select_mode = $(this).val();
});
table_cross.on({
    "mousemove" : function (e) {
        const target = $(e.target);
        const row = parseInt(target.attr("data-row")), col = parseInt(target.attr("data-col"));
        
        hl.css({
            "display" : "block"
        });
        hl_row.css({
            "top" : `${cell_size * (row + max_clue_size[1])}px`
        });
        hl_col.css({
            "left" : `${cell_size * (col + max_clue_size[0])}px`
        });
        if (color === 3) {
            changeClick(select_mode, target);
        } else {
            table[row][col] = color;
            recolor(target, color);
        }
    },
    "mouseleave" : function (e) {
        const target = $(e.target);

        hl.css({
            "display" : "none"
        });
        color = 3;
        changeClick(select_mode, target);
    },
    "mousedown" : function (e) {
        const target = $(e.target);
        const row = parseInt(target.attr("data-row")), col = parseInt(target.attr("data-col"));

        color = e.button === 0 || e.which === 1 ? color_left : e.button === 2 || e.which === 3 ? color_right : 3;
        if (color !== 3) {
            table[row][col] = color;
            recolor(target, color);
        }
    },
    "mouseup" : function (e) {
        const target = $(e.target);

        hl.css({
            "display" : "none"
        });
        color = 3;
        changeClick(select_mode, target);
    }
});
