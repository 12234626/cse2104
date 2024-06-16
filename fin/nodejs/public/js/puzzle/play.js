const input_password = form.find("#password");
const button_delete = form.find("#delete"), button_submit = form.find("#submit");

button_submit.click(async function () {
    await fetch("/puzzle/check", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "clue" : clue,
            "table" : table
        })
    })
    .then(res => res.json())
    .then(res => {
        alert(res ? "맞았습니다" : "틀렸습니다");
    });
});
button_delete.click(async function() {
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
