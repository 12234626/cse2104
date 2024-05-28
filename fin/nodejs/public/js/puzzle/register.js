$(document).ready(function () {
    const form = $("form"), input_author = form.find("[name=author]"), input_password = form.find("[name=password]"), input_title = form.find("[name=title]"), input_size = form.find(".input_size"), input_row = form.find("#row"), input_col = form.find("#col");
    const button_examine = form.find("#examine"), button_register = form.find("#register");
    const examine_result = $("#examine_result"), examine_result_author = examine_result.find("tbody td:nth-child(2)"), examine_result_title = examine_result.find("tbody td:nth-child(3)"), examine_result_size = examine_result.find("tbody td:nth-child(4)"), examine_result_xd = examine_result.find("tbody td:nth-child(5)"), examine_result_logic = examine_result.find("tbody td:nth-child(6)");
    const hl = $(".hl"), hl_row = $("#hl_row"), hl_col = $("#hl_col");
    const table_container = $("#table_container"), table_cross = table_container.find("#cross")

    const makePOSTData = function () {
        const row = parseInt(input_row.val()), col = parseInt(input_col.val());
        const clue = [row, col];

        for (let i = 0; i < row; ++i) {
            const temp = [];
            let cnt = 0;

            for (let j = 0; j < col; ++j) {
                if (table[i][j] === 2) ++cnt;
                else if (cnt) {
                    temp.push(cnt);
                    cnt = 0;
                }
            }
            if (cnt) temp.push(cnt);
            if (!temp.length) temp.push(0);
            clue.push(temp.length, ...temp);
        }
        for (let j = 0; j < col; ++j) {
            const temp = [];
            let cnt = 0;

            for (let i = 0; i < row; ++i) {
                if (table[i][j] === 2) ++cnt;
                else if (cnt) {
                    temp.push(cnt);
                    cnt = 0;
                }
            }
            if (cnt) temp.push(cnt);
            if (!temp.length) temp.push(0);
            clue.push(temp.length, ...temp);
        }

        return {
            "author" : input_author.val(),
            "title" : input_title.val(),
            "password" : input_password.val(),
            "clue" : clue
        };
    }

    Object.assign(table, Array.from(Array(200), () => new Array(200).fill(1)));

    table_cross.find(".cell").addClass("white");
    input_size
    .change(function () {
        if (parseInt($(this).val()) <= 0) $(this).val(1);
        if (parseInt($(this).val()) > 200) $(this).val(200);
        hl_row.css({
            "width" : `${cell_size * parseInt(input_col.val())}px`,
        });
        hl_col.css({
            "height" : `${cell_size * parseInt(input_row.val())}px`
        });
        table_cross.css({
            "width" : `${cell_size * parseInt(input_col.val())}px`,
            "height" : `${cell_size * parseInt(input_row.val())}px`
        });
    })
    .change();

    button_examine.click(async function () {
        await fetch("/puzzle/examine", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(makePOSTData())
        })
        .then(res => res.json())
        .then(function (res) {
            if (res) {
                examine_result_author.text(`${res["author"]}`);
                examine_result_title.text(`${res["title"]}`);
                examine_result_size.text(`${res["row"]}×${res["col"]}`);
                examine_result_xd.text(`${res["xd"]} (${res["xd_mag"].toFixed(1)})`);
                examine_result_logic.text(`${res["logic"]}`);
                
                alert("검증에 성공하였습니다");
            } else {
                alert("검증에 실패하였습니다");
            }
        })
        .catch(error => {
            console.error(error);

            alert("검증에 실패하였습니다");
        });
    });
    button_register.click(async function () {
        await fetch("/puzzle/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(makePOSTData())
        })
        .then(res => res.json())
        .then(function (res) {
            if (res) {
                alert("퍼즐을 등록하였습니다");

                window.location.replace("/");
            } else {
                alert("퍼즐을 등록하지 못하였습니다");
            }
        })
        .catch(error => {
            console.error(error);

            alert("검증에 실패하였습니다");
        });
    });
});
