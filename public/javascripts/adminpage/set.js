/**
 * Created by mamol on 16/06/29.
 */
$(function () {
        $("#staff_massage_confirm").click(
            function () {

                $("#user_sign_up").validationEngine();

                $("#staff_name").val($("#staff_name_check").html());
                $("#staff_sex").val($("#staff_sex_check").html());
                $("#staff_birthday").val($("#staff_birthday_check").html());
                $("#staff_email").val($("#staff_email_check").html());
                $("#staff_tel").val($("#staff_tel_check").html());
                $("#staff_address").val($("#staff_address_check").html());
                $("#staff_signup_date").val($("#staff_signup_date_check").html());
                $("#staff_occupation").val($("#staff_occupation_check").html());

                $("#signup_massage").show();
                $("#signup_confirm").hide()
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
            yearRange: '1950:'
        }
    );
});

$(function() {
    var dateFormat = 'yy-mm-dd';
    $( "#staff_signup_date" ).datepicker(
        {
            dateFormat: dateFormat,
            changeYear: true,
            changeMonth: true,
            yearRange: '1950:'
        }
    );
});