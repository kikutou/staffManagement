/**
 * Created by mamol on 16/06/25.
 */
$(function () {
    $("#chose1").click(function () {
        $("#form_1").css('display', 'inline-table');
        $("#form_2").css('display', 'none');
        $("#form_3").css('display', 'none');
    });
    $("#chose2").click(function () {
        $("#form_2").css('display', 'inline-table');
        $("#form_1").css('display', 'none');
        $("#form_3").css('display', 'none');
    });
    $("#chose3").click(function () {
        $("#form_3").css('display', 'inline-table');
        $("#form_1").css('display', 'none');
        $("#form_2").css('display', 'none');
    });

    $("#fre_1").click(function () {
        $("#form_1").validationEngine();
    });
    $("#fre_2").click(function () {
        $("#form_2").validationEngine();
    });
    $("#fre_3").click(function () {
        $("#form_3").validationEngine();
    });
});