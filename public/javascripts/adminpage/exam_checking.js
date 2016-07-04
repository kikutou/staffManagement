/**
 * Created by mamol on 16/07/04.
 */
$(function () {
    //評価の回数を選ぶ
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
    //評価する
    $("#modify_1").click(function () {
        $("#fre_1").show();
        $("#modify_1").hide();
        $(".slt_slt_1").show();
        $(".slt_view_1").hide()
    });
    $("#modify_2").click(function () {
        $("#fre_2").show();
        $("#modify_2").hide();
        $(".slt_slt_2").show();
        $(".slt_view_2").hide()
    });
    $("#modify_3").click(function () {
        $("#fre_3").show();
        $("#modify_3").hide();
        $(".slt_slt_3").show();
        $(".slt_view_3").hide()
    });
    //validation
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