$(document).ready(function() {
    $('.work-duration-input').on('input', function() {
        $(this).trigger('change');
    });
    $('.work-duration-input').on('change', function() {
        $('.work-duration-value').html($(this).val() + " min");
        $('.work-clock .display').html($(this).val() + ":00");
    });
    $('.break-duration-input').on('input', function() {
        $(this).trigger('change');
    });
    $('.break-duration-input').on('change', function() {
        $('.break-duration-value').html($(this).val() + " min");
        $('.break-clock .display').html($(this).val() + ":00");
    });
});