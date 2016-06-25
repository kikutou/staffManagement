/**
 * Created by mamol on 16/06/25.
 */
$(function () {
    $("#select_1").val("１回");
    $("#select_2").val("２回");
    $("#select_3").val("３回");

    $(".exam_op_1").select(
        function () {
            alert('1');
            $("#table_1").show();
            $("#table_2").hide();
            $("#table_3").hide()

        }
    );
    $(".exam_op_2").select(
        function () {
            alert("2");
            $("#table_2").show();
            $("#table_1").hide();
            $("#table_3").hide()

        }
    );
    $(".exam_op_3").select(
        function () {
            alert("3");
            $("#table_3").show();
            $("#table_1").hide();
            $("#table_2").hide()

        }
    );



















});