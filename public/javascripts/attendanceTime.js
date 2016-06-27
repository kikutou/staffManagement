
    $(function() {
        // input localtime
        function showTime(){
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();


            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (minute < 10) {
                minute = '0' + minute;
            }
            if (second < 10) {
                second = '0' + second;
            }
            var dateStr = year+"-"+month+"-"+day+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+hour+":"+minute+":"+second;
            var dateTime = hour+":"+minute+":"+second;

            $("#entrance_button").val(dateTime);
            $("#leave_button").val(dateTime);

            // show localtime
            $("#entrance_button").mouseenter(
                function () {
                    $(this).html("現在の時間："+dateStr);
                }
            );
            

            $("#leave_button").mouseenter(
                function(){
                    $(this).html("現在の時間："+dateStr);
                }
            );

            // hide localtime
            $("#entrance_button").mouseleave(
                function () {
                    $(this).html("入室確認");
                }
            );

            $("#leave_button").mouseleave(
                function () {
                    $(this).html("退室確認");
                }
            );
            



            for (var i=0; i<8; i++){
                var timestamp = date.getTime();
                var timestamp_add = 1000*60*60*24;
                var nowdate = new Date(timestamp-(i*timestamp_add));
                var nowday = nowdate.toLocaleDateString().replace('/', '-').replace('/', '-');
                $("#date_"+ i).html(nowday);
            }
        }
        window.setInterval(showTime,100);
    });


