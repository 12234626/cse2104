$(document).ready(async function () {
    const input_password = $("#password");
    const delete_button = $("#delete");
    const button_submit = $("#submit");
    const solution = await fetch("/puzzle/solve", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "clue" : clue
        })
    })
    .then(res => res.json());

    button_submit.click(async function () {
        let flag = false;

        for (let i = 0; i < clue[0]; ++i) for (let j = 0; j < clue[1]; ++j) if ((solution[i][j] === 2) !== (table[i][j] === 2)) flag = true;

        alert(flag ? "틀렸습니다" : "맞았습니다");
    });
    delete_button.click(async function(e) {
        e.preventDefault();

        if (confirm("퍼즐을 삭제하시겠습니까?")) {
            await fetch("/puzzle/delete", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "id" : puzzle["id"],
                    "password" : input_password.val()
                })
            })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    alert("퍼즐을 삭제하였습니다");

                    window.location.replace("/");
                } else {
                    alert("퍼즐을 삭제하지 못하였습니다");
                }
            });
        }
    });
    cancel_button.click(function() {

    });
});
