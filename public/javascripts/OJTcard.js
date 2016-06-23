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
        var nowday = nowdate.toLocaleDateString().replace('/', '-').replace('/', '-');

        $("#ojt_day"+ i).html(nowday);
    }
    
    $('#modify').click(
        function () {
            $('#study_sub').attr('disabled', true);
            $('.study_text').show();
            $('.study_content').hide();
            $('#modify').hide();
            $('#enter').show()
        }
    );
    $('#enter').click(
        function () {
            $('#study_sub').attr('disabled', false);
            for (var j=1; j<8; j++){
                $('#content'+j).html($('#re_content'+j).val());
                $('#self_report'+j).html($('#re_self_report'+j).val())
            }
            $('.study_text').hide();
            $('.study_content').show();
            $('#modify').show();
            $('#enter').hide()
        }
    );
    
});
