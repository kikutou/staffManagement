/**
 * Created by mamol on 16/06/11.
 */

$(function () {
        $("#signup_submit").click(
            function () {

                $("#user_sign_up").validationEngine();

                if ($("#user_sign_up").validationEngine('validate')){
                    $("#staff_name_check").html($("#staff_name").val());
                    $("#staff_sex_check").html($("#staff_sex").val());
                    $("#staff_birthday_check").html($("#staff_birthday").val());
                    $("#staff_email_check").html($("#staff_email").val());
                    $("#staff_tel_check").html($("#staff_tel").val());
                    $("#staff_address_check").html($("#staff_address").val());
                    $("#staff_signup_date_check").html($("#staff_signup_date").val());
                    $("#staff_occupation_check").html($("#staff_occupation").val());

                    $("#signup_massage").hide();
                    $("#signup_confirm").show()
                }
            }
        )
    }
);

$(function() {
    var dateFormat = 'yy-mm-dd';
    $( "#staff_birthday" ).datepicker(
        {
            dateFormat: dateFormat,
            changeYear: true,
            changeMonth: true,
            yearRange: '1950:',
        }
    );
});

$(function() {
    var dateFormat = 'yy-mm-dd';
    $( "#staff_signup_date" ).datepicker(
        {
            dateFormat: dateFormat,
            changeYear: true,
            changeMonth: true
        }
    );
});

$(function () {
    $("#staff_massage_confirm").click(
        function () {
            $("#signup_massage").show();
            $("#signup_confirm").hide()
        })
})