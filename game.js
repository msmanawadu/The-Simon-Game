var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var startedState = false;

//Wiring a keyboard event listener to the document to start off
$(document).on("keypress", handleKeyPress);

function handleKeyPress() {
    //Wiring a mouse event listener to all buttons
    $("div.btn").on("click", handleClick);
    nextSequence();
}

//Generates a random button on start
function nextSequence() {
    //employing a boolean switch
    if (!startedState) {
        startedState = true; //Game has started
        //Reset User's Click Sequence
        userClickedPattern = [];
        var randomNumber = Math.floor(Math.random() * 4);
        var randomChosenColor = buttonColors[randomNumber];
        gamePattern.push(randomChosenColor);

        console.log("game- " + gamePattern);

        animateAndPlaySoundAtStart(randomChosenColor);
        levelUpgrade();
    }
}

function handleClick() {
    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);

    //validating each user click with array index
    checkAnswer(userClickedPattern.length - 1);
}

//update h1 to Level 1
function levelUpgrade() {
    level += 1;
    $("h1#level-title").text("Level " + level);
}

//Animate and play the start button sound
function animateAndPlaySoundAtStart(randomChosenColor) {
    var targetButton = "div#" + randomChosenColor;
    //flash animation and playsound
    $(targetButton).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
}

//Play button sound
function playSound(name) {
    var soundSource = "./sounds/" + name + ".mp3";
    var gameSound = new Audio(soundSource);
    gameSound.play();
}

//Animation for button press
function animatePress(userChosenColor) {
    var targetButton = "div#" + userChosenColor;
    $(targetButton).addClass("pressed");
    setTimeout(function () {
        $(targetButton).removeClass("pressed");
    }, 100);
}

//Validating user's pattern against game pattern
function checkAnswer(currentLevel) {
    //checking whether the latest element in user sequence matches with corresponding game sequence element
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        //checking whether the user sequence is done
        if (userClickedPattern.length === gamePattern.length) {
            console.info("Success (Keep Adding...)");
            //to avoid user messing up with (repeated) unintended button clicks
            $("div.btn").off("click", handleClick);
            setTimeout(function () {
                $("div.btn").on("click", handleClick);
                startedState = false;
                nextSequence();
            }, 1500);
        }
    } else {
        //to avoid user button clicks after game over
        $("div.btn").off("click", handleClick);
        console.log("Wrong !");
        wrongClick();
    }
    console.log("user- " + userClickedPattern);
}

function wrongClick() {
    startOver();
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 250);
    $("h1#level-title").text("Game Over, Press Any Key to Restart");
}

function startOver() {
    level = 0;
    gamePattern = [];
    startedState = false;
}