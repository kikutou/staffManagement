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
});