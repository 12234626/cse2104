$(document).ready(function () {
    const form = $("form");
    const col_min = form.find("#col_min"), col_max = form.find("#col_max");
    const row_min = form.find("#row_min"), row_max = form.find("#row_max");
    // const logic_false = form.find("#logic_false"), logic_true = form.find("#logic_true");
    const xd_min = form.find("#xd_min"), xd_max = form.find("#xd_max");
    const xd_mag_min = form.find("#xd_mag_min"), xd_mag_max = form.find("#xd_mag_max");
    const date_start = form.find("#date_start"), date_end = form.find("#date_end");
    // const sort = form.find("#sort"), reverse = form.find("#reverse");

    col_min.change(function () {
        if (parseInt($(this).val()) <= 0) $(this).val(1);
        if (parseInt($(this).val()) > parseInt(col_max.val())) $(this).val(col_max.val());
    });
    col_max.change(function () {
        if (parseInt($(this).val()) > 200) $(this).val(200);
        if (parseInt($(this).val()) < parseInt(col_min.val())) $(this).val(col_min.val());
    });
    row_min.change(function () {
        if (parseInt($(this).val()) <= 0) $(this).val(1);
        if (parseInt($(this).val()) > parseInt(row_max.val())) $(this).val(row_max.val());
    });
    row_max.change(function () {
        if (parseInt($(this).val()) > 200) $(this).val(200);
        if (parseInt($(this).val()) < parseInt(row_min.val())) $(this).val(row_min.val());
    });
    xd_min.change(function () {
        if (parseInt($(this).val()) <= 0) $(this).val(1);
        if (parseInt($(this).val()) > parseInt(xd_max.val())) $(this).val(xd_max.val());
    });
    xd_max.change(function () {
        if (parseInt($(this).val()) < parseInt(xd_min.val())) $(this).val(xd_min.val());
    });
    xd_mag_min.change(function () {
        if (parseInt($(this).val()) <= 0) $(this).val(1);
        if (parseInt($(this).val()) > parseInt(xd_mag_max.val())) $(this).val(xd_mag_max.val());
    });
    xd_mag_max.change(function () {
        if (parseInt($(this).val()) < parseInt(xd_mag_min.val())) $(this).val(xd_mag_min.val());
    });
    date_start.change(function () {
        if (new Date($(this).val()) > new Date(date_end.val())) $(this).val(date_end.val());
    });
    date_end.change(function () {
        if (new Date($(this).val()) < new Date(date_start.val())) $(this).val(date_start.val());
    });
});
