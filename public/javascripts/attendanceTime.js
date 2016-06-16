
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
            var dateStr = year+"/"+month+"/"+day+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;"+hour+":"+minute+":"+second;
            var dateTime = hour+":"+minute+":"+second;

            // show localtime
            $("#entrance_button").mouseenter(
                function () {
                    $(this).html("現在の時間："+dateStr);
                    $("#entrance_button").val(dateTime);
                }
            );

            $("#leave_button").mouseenter(
                function(){
                    $(this).html("現在の時間："+dateStr);
                    $("#leave_button").val(dateTime);
                });

            // hide localtime
            $("#entrance_button").mouseleave(
                function () {
                    $(this).html("入室確認");
                });

            $("#leave_button").mouseleave(
                function () {
                    $(this).html("退室確認");
                });
        }
        window.setInterval(showTime,100);
    });


