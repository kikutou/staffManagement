/**
 * Created by mamol on 16/07/02.
 */
$(function () {
    var now = new Date();
    var week = now.getDay();

    if (week == 0){
        week = 7;
    }

    for (var i=0; i<5; i++){

        for (var j=1; j<8; j++){
            var the_day = new Date();
            the_day.setDate(now.getDate() - (7 * i) - (week - j));
            var datestr = the_day.toISOString().substring(0, 10);

            $("#ojt_day"+ i + j).html(datestr);
            $("#ojt_day_hidden"+ i + j).html(datestr);

            $("#re_content"+ i + j).val($("#content"+ i + j).text());
            $("#re_self_report"+ i + j).val($("#self_report"+ i + j).text());
            $("#re_percent"+ i + j).val($("#percent"+ i + j).text());
            $("#re_teacher"+ i).val($("#teacher"+ i).text());
            $("#hidden_ojt_day"+ i + j).val(datestr)
        }
    }

    var a = [0, 1, 2, 3, 4];
    $.each(a, function (m) {
        $("#modify"+ m).click(function () {
            $("#study_sub"+ m).show();
            $("#modify"+ m).hide();
            $("#re_teacher"+ m).show();
            $("#teacher"+ m).hide();
            for (var k=1; k<8; k++) {
                $("#re_content"+ m + k).show();
                $("#re_self_report"+ m + k).show();
                $("#re_percent"+ m + k).show();
                $("#content"+ m + k).hide();
                $("#self_report"+ m + k).hide();
                $("#percent"+ m + k).hide();
            }
        })
    });
});