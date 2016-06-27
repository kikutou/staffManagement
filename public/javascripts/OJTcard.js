/**
 * Created by mamol on 16/06/22.
 */

$(function () {
    var date = new Date();
    for (var i=1; i<8; i++){
        var week = date.getDay();
        if (week == 0){
            week = 7;
        }
        var timestamp = date.getTime();
        var timestamp_add = 1000*60*60*24;
        var nowdate = new Date(timestamp-((week-i)*timestamp_add));
        var nowday = nowdate.toISOString().substring(0, 10);

        var lastdate = new Date(timestamp-((week-i+7)*timestamp_add));
        var lastday =  lastdate.toISOString().substring(0, 10);

        $("#ojt_day"+ i).html(nowday);
        $("#ojt_day_hidden"+ i).val(nowday);
        $('#re_content'+i).val($('#content'+i).text());
        $('#re_self_report'+i).val($('#self_report'+i).text());
        $('#re_percent'+i).val($('#percent'+i).text());

        $("#last_day"+ i).html(lastday)
    }
    
    $('#modify').click(
        function () {
            $('#study_sub').show();
            $('.study_text').show();
            $('.study_content').hide();
            $('#modify').hide();
        }
    );
    $('#study_sub').click(
        function () {
            $('.study_text').hide();
            $('.study_content').show();
            $('#modify').show();
            $('#study_sub').hide()
        }
    );
});
