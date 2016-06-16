/**
 * Created by mamol on 16/06/14.
 */
$(function() {
    var dateFormat = 'yy-mm-dd';
    $('.study_date').datepicker(
        {
            dateFormat: dateFormat,
            changeYear: true,
            changeMonth: true
        }
    );
});