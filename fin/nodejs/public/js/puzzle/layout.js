const form = $("form"), input_select = form.find(".input_select");
const color_preview_left = $("#color_preview_left"), color_preview_right = $("#color_preview_right");
const table_container = $("#table_container"), table_clue_row = table_container.find("#clue_row"), table_clue_col = table_container.find("#clue_col"), table_cross = table_container.find("#cross"), table_interact = table_container.find("#interact");
const hl = $(".hl"), hl_row = $("#hl_row"), hl_col = $("#hl_col");
const cell_cross = table_cross.find(".cell.cross");
const cell_size = 20;

const puzzle = {}, clue = [], max_clue_size = [], table = [];
let select_mode = input_select.filter("[checked=checked]").val(), color = 3, color_left = 3, color_right = 3;
let prev_x = 0, prev_y = 0;

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
table_interact.on({
    "mousemove" : function (e) {
        const next_x = parseInt(e.offsetX), next_y = parseInt(e.offsetY);

        hl.css({
            "display" : "block"
        });
        hl_row.css({
            "top" : `${next_y - next_y % cell_size + cell_size * max_clue_size[1]}px`
        });
        hl_col.css({
            "left" : `${next_x - next_x % cell_size + cell_size * max_clue_size[0]}px`
        });

        if (color === 3) {
            const row = Math.floor(next_y / cell_size), col = Math.floor(next_x / cell_size);
            const target = $(cell_cross[row * clue[1] + col]);

            changeClick(select_mode, target);
        } else {
            const precision = 2 / 20;
            const diff_x = next_x - prev_x, diff_y = next_y - prev_y, dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
            const dx = diff_x / dist / precision, dy = diff_y / dist / precision;
            for (let i = 0; i < precision * Math.sqrt(diff_x ** 2 + diff_y ** 2); ++i) {
                const row = Math.floor((prev_y + i * dy) / cell_size), col = Math.floor((prev_x + i * dx) / cell_size);
                const target = $(cell_cross[row * clue[1] + col]);

                table[row][col] = color;
                recolor(target, color);
            }
        }

        prev_x = next_x;
        prev_y = next_y;
    },
    "mouseleave" : function (e) {
        const row = Math.floor(parseInt(e.offsetY) / cell_size), col = Math.floor(parseInt(e.offsetX) / cell_size);
        const target = $(cell_cross[row * clue[1] + col]);

        hl.css({
            "display" : "none"
        });
        color = 3;
        changeClick(select_mode, target);
    },
    "mousedown" : function (e) {
        const row = Math.floor(parseInt(e.offsetY) / cell_size), col = Math.floor(parseInt(e.offsetX) / cell_size);
        const target = $(cell_cross[row * clue[1] + col]);

        color = e.button === 0 || e.which === 1 ? color_left : e.button === 2 || e.which === 3 ? color_right : 3;
        if (color !== 3) {
            table[row][col] = color;
            recolor(target, color);
        }
    },
    "mouseup" : function (e) {
        const row = Math.floor(parseInt(e.offsetY) / cell_size), col = Math.floor(parseInt(e.offsetX) / cell_size);
        const target = $(cell_cross[row * clue[1] + col]);

        color = 3;
        changeClick(select_mode, target);
    }
});
