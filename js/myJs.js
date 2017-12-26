$(document).ready(function() {
    /*All durations are in seconds*/
    let workTimeDuration = 0;
    let breakTimeDuration = 0;
    let isSessionPlayed = false; //If the timer is in pauso or stoped
    let isInWorking = true; //Indicate if the timer is for the working or breaking time
    let intervalId = 0;


    //PlayListener 
    addPlayButtonListener();

    //Input slide listeners
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
    /*
     *This function return a string which represents the
     *hours and seconds equivalents to the seconds passed 
     */
    function secondsToHours(seconds) {
        return parseInt(seconds / 60) + ":" + (seconds % 60 < 10 ? "0" + seconds % 60 : seconds % 60);
    }

    /*This variable is declared here because it is used only in the function above*/
    let flipAnimationCompleated = true;

    function clockTick() {
        if (!flipAnimationCompleated) return;
        if (isInWorking) {
            workTimeDuration--;
            $('.work-clock .display').html(secondsToHours(workTimeDuration));
            if (workTimeDuration === 0) { //The work time has finished
                workTimeDuration = Number.parseInt($('.work-duration-input').val()) * 60; //Restore work duration
                console.log("WORK TIME", workTimeDuration);
                isInWorking = false;
                $('.work-clock .clock-hand').removeClass('tick-tack');
                $('.clock').css('transform', 'rotateY(180deg)');
                flipAnimationCompleated = false;
                let animationInterval = setInterval(function() {
                    $('.break-clock .clock-hand').addClass('tick-tack');
                    $('.work-clock .display').html($('.work-duration-input').val() + ":00"); //Restore the clock display after it has flipped
                    flipAnimationCompleated = true;
                    clearInterval(animationInterval);
                }, 1000); //Add tick-tack class when the animation has ended
            }
        } else {
            breakTimeDuration--;
            $('.break-clock .display').html(secondsToHours(breakTimeDuration));
            if (breakTimeDuration === 0) { //The work time has finished
                breakTimeDuration = Number.parseInt($('.break-duration-input').val()) * 60; //Restore break duration
                isInWorking = true;
                $('.break-clock .clock-hand').removeClass('tick-tack');
                $('.clock').css('transform', 'rotateY(0deg)');
                flipAnimationCompleated = false;
                let animationInterval = setInterval(function() {
                    $('.work-clock .clock-hand').addClass('tick-tack');
                    $('.break-clock .display').html($('.break-duration-input').val() + ":00"); //Restore the clock display after it has flipped
                    flipAnimationCompleated = true;
                    clearInterval(animationInterval);
                }, 1000); //Add tick-tack class when the animation has ended
            }
        }
    }

    function addPlayButtonListener() {
        $('.btn-play').on('click', function() {
            console.log("PLAY");
            //Remove the Play button and add the Pause and Stop buttons with his listeners
            $('.clock-buttons-animation').html("<a class='btn-pause'><i class='fas fa-pause'></i></a> <a class='btn-stop'><i class='fas fa-stop'></i></a>");
            addPauseStopButtonListener();
            /*Is important to keep both durations in seconds that the reason of the *60*/
            workTimeDuration = Number.parseInt($('.work-duration-input').val()) * 60;
            breakTimeDuration = Number.parseInt($('.break-duration-input').val()) * 60;
            //Disable the slider to avoid changing the sessions' durations
            $('.work-duration-input').prop('disabled', true);
            $('.break-duration-input').prop('disabled', true);

            isSessionPlayed = true;
            intervalId = setInterval(clockTick, 1000);
            $('.work-clock .clock-hand').addClass('tick-tack');
        });
    }

    function addPauseStopButtonListener() {
        $('.btn-pause').on('click', function() {
            console.log("PAUSE");
            if (isSessionPlayed) {
                isSessionPlayed = false;
                clearInterval(intervalId); //Stop clock
                if (isInWorking) //Stop clock animation (work one or break one)
                    $('.work-clock .clock-hand').removeClass('tick-tack');
                else
                    $('.break-clock .clock-hand').removeClass('tick-tack');
                /*Change icon*/
                $('.btn-pause').html('<i class="fas fa-play"></i>');

            } else {
                isSessionPlayed = true;
                intervalId = setInterval(clockTick, 1000); //Stop clock
                if (isInWorking) //Stop clock animation (work one or break one)
                    $('.work-clock .clock-hand').addClass('tick-tack');
                else
                    $('.break-clock .clock-hand').addClass('tick-tack');
                /*Change icon*/
                $('.btn-pause').html('<i class="fas fa-pause"></i>');
            }
        });

        $('.btn-stop').on('click', function() {
            console.log("STOP");
            //Remove the Pause and Stop button and add the Play one
            $('.clock-buttons-animation').html('<a class="btn-play"><i class="fas fa-play"></i></a>');
            addPlayButtonListener();
            isSessionPlayed = false;
            clearInterval(intervalId);
            if (isInWorking) { //Stop clock animation (work one or break one)
                $('.work-clock .clock-hand').removeClass('tick-tack');
                $('.work-duration-input').prop('disabled', false);
                $('.break-duration-input').prop('disabled', false);
                $('.work-clock .display').html($('.work-duration-input').val() + ":00");
                $('.break-clock .display').html($('.break-duration-input').val() + ":00");
            } else {
                $('.break-clock .clock-hand').removeClass('tick-tack');
                $('.clock').css('transform', 'rotateY(0deg)');
                let animationInterval = setInterval(function() {
                    //Make the slider available again
                    $('.work-duration-input').prop('disabled', false);
                    $('.break-duration-input').prop('disabled', false);
                    $('.work-clock .display').html($('.work-duration-input').val() + ":00");
                    $('.break-clock .display').html($('.break-duration-input').val() + ":00");
                    clearInterval(animationInterval);
                }, 1000); //Add tick-tack class when the animation has ended
            }
            /*Because we have just stop the pomodoro and when the 
             *play button is played it will start from the begining of the workign session*/
            isInWorking = true;
        });
    }
});