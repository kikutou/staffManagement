/**
 * Created by mamol on 16/06/14.
 */
$(
    function () {
        $('#login_submit').click(
            function () {
                $('#user_login').validationEngine()
            }
        )
    }
)