const input_author = form.find("[name=author]"), input_password = form.find("[name=password]"), input_title = form.find("[name=title]"), input_file = form.find("[name=file]"), input_size = form.find(".input_size"), input_row = form.find("#row"), input_col = form.find("#col");
const button_examine = form.find("#examine"), button_register = form.find("#register");
const examine_result = $("#examine_result tbody td");
const canvas = $("<canvas></canvas>")[0], ctx = canvas.getContext("2d", {willReadFrequently : true});

Object.assign(table, Array.from(Array(200), () => new Array(200).fill(1)));

table_cross.find(".cell").addClass("white");
input_file.change(function () {
    const file = this.files[0];

    if (file) {
        const img = new Image();

        $(img).on("load", function () {
            const width = img.width, height = img.height;
        
            if (width > 200 || height > 200) {
                alert("올바르지 않은 이미지입니다");
            } else {
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
            
                const img_arr = ctx.getImageData(0, 0, width, height).data;
            
                for (let row = 0; row < height; ++row) for (let col = 0; col < width; ++col) {
                    color = img_arr[(row * width + col) * 4] + img_arr[(row * width + col) * 4 + 1] + img_arr[(row * width + col) * 4 + 2] > 382 ? 1 : 2;
                    table[row][col] = color;
                    recolor($(cell_cross[row * clue[1] + col]), color);
                }
                color = 3;
                input_row.val(height);
                input_col.val(width);
                input_size.change();
            }
        });
        
        img.src = window.URL.createObjectURL(file);
    }
});
input_size
.change(function () {
    if (parseInt($(this).val()) <= 0) $(this).val(1);
    if (parseInt($(this).val()) > 200) $(this).val(200);
    hl_row.css({
        "top" : `0`,
        "width" : `${cell_size * parseInt(input_col.val())}px`
    });
    hl_col.css({
        "left" : `0`,
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
        body: JSON.stringify({
            "author" : input_author.val(),
            "title" : input_title.val(),
            "password" : input_password.val(),
            "row" : parseInt(input_row.val()),
            "col" : parseInt(input_col.val()),
            "table" : table
        })
    })
    .then(res => res.json())
    .then(function (res) {
        if (res) {
            $(examine_result[0]).text(`${res.author}`);
            $(examine_result[1]).text(`${res.title}`);
            $(examine_result[2]).text(`${res.row}\u00d7${res.col}`);
            $(examine_result[3]).text(`${res.xd} (${res.xd_mag.toFixed(1)})`);
            $(examine_result[4]).text(`${res.logic ? "선택" : "단일"}`);

            alert("검증에 성공하였습니다");
        } else {
            $(examine_result[0]).text("");
            $(examine_result[1]).text("");
            $(examine_result[2]).text("");
            $(examine_result[3]).text("");
            $(examine_result[4]).text("");

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
        body: JSON.stringify({
            "author" : input_author.val(),
            "title" : input_title.val(),
            "password" : input_password.val(),
            "row" : parseInt(input_row.val()),
            "col" : parseInt(input_col.val()),
            "table" : table
        })
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
