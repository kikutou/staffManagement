/**
 * Created by mamol on 16/06/29.
 */
$(function () {
    var now = new Date();
    var timestamp = now.getTime();
    var timestamp_add = 1000*60*60*24;

    for (var i=0; i<31; i++){
        var nowdate = new Date(timestamp-(i*timestamp_add));
        var nowday = nowdate.toLocaleDateString().replace('/', '-').replace('/', '-');

        $("#date_"+ i).html(nowday);
    }

    $("#time_button_1").click(function () {
        $("#time_input_1").show();
        $("#time_submit_1").show();
        $("#time_button_1").hide();
        $("#time_text_1").hide()
    });

    $("#time_button_2").click(function () {
        $("#time_input_2").show();
        $("#time_submit_2").show();
        $("#time_button_2").hide();
        $("#time_text_2").hide()
    });

    $("#time_form_1").validationEngine();
    $("#time_form_2").validationEngine();
});