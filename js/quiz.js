"use strict;";
/* jshint esversion: 6*/

/**
 * This array contains the questions in the quiz (index 0), the possible answers (1-4), the correct answer (5), and any multimedia elements (6)
 */
const QUIZ_ARRAY = [
    ["Een webpagina bestaat typisch uit", "HTML", "C++", "HTML, CSS en Javascript", "HTML, CSS en Java", 'C', ''],
    ["Om een groep elementen te veranderen in CSS moet je", "Een groep geven in de CSS bestand", "Een groep maken in Javascript", "Een class maken in HTML", "Allemaal in hetzelfde grid zetten", 'C', ''],
    ["Wat mist er van deze functie?", "}", "{", "return", ";", 'A', 'multimedia/badfunction.png'],
    ["Wat is het verschil tussen Flexbox en Grid?", "Er is geen verschil", "Flexbox is voor Chrome, Grid is voor Firefox", "Flexbox is een-dimensionaal, Grid is twee-dimensionaal", "Flexbox is drie-dimensionaal, Grid is twee-dimensionaal", 'C', '', ],
    ["Waar kunnen var a en var b gebruikt worden", "Beide overal", "a overal, b alleen in de functie, en alle functies de er in example geropen wordt", "Beide alleen in de functie", "a overal, b alleen in de functie", 'D', 'multimedia/variables.png'],
    ["Hoe krijg je 'claire' uit deze array?", "arr[2][3]", "arr[1][2]", "arr['claire']", "arr[1[2]]", 'B', 'multimedia/array.jpg'],
    ["Welk javascript methode gebruik je om tekst te laten verschijnen zoals in de gif? (Zonder nieuwe functies te maken)", "foo.style.innerText = 'Alex Sutherland'", "foo.inner-text = 'Alex Sutherland'", "foo.innerText = 'Alex Sutherland'", "text&#8203;('foo', 'Alex Sutherland')", 'C', 'multimedia/textappear.gif'],
    ["Hoe selecteer je een individuele element in css", ".element", "#element", "element", "$element", 'B', ''],
    ["Als a = 8, en b =7, welke van de volgende is FALSE", "a >= b", "a > b", "a != b", " a <= b", 'D', ''],
    ["Wat is de output op de console?", 'undefined', '"blue" undefined', '"blue" "blue"', '"white" "blue"', 'B', 'multimedia/function.png']
];
const QUIZMASTER = "s1160498";
var scoreTally = 0;
var questionNumber = 0;
var userAnswer = [];
var quizTimer;
var studentObject;
var timeTally = 0;

/**
 * Add actions to page buttons 
 */
function addButtonActions() {
    var questionsButton = document.getElementById('button-questions');
    var answerA = document.getElementById('answer-a');
    var answerB = document.getElementById('answer-b');
    var answerC = document.getElementById('answer-c');
    var answerD = document.getElementById('answer-d');
    var last = document.getElementById('question-last');
    var next = document.getElementById('question-next');
    var name = document.getElementById('name-confirm');

    answerA.addEventListener("click", function() {
        giveAnswer('A');
    });

    answerB.addEventListener("click", function() {
        giveAnswer('B');
    });

    answerC.addEventListener("click", function() {
        giveAnswer('C');
    });

    answerD.addEventListener("click", function() {
        giveAnswer('D');
    });

    last.addEventListener("click", function() {
        if (questionNumber !== 0) {
            questionNumber--;
            quizUpdate();
            feedback();
        }
    });

    next.addEventListener("click", function() {
        if (questionNumber == 9 && userAnswer.length == 10) {
            getScores();
            showEndPage();
            //if on the last question, and all questions are answered
        } else if (userAnswer.length > questionNumber) {
            questionNumber++;
            quizUpdate();
            if (userAnswer.length > questionNumber) {
                feedback();
            }
        }

        //if userAnswer.length == questionNumber, do nothing
    });

    questionsButton.addEventListener("click", function() {
        if (studentObject) {
            showQuestionsPage();
        }
    });

    name.addEventListener("click", function() {
        processInput(document.getElementById("name-input").value);
    });
}

//gets the button corresponding to the character, for ease of use and reduction of switch statements
function getButton(answerLetter) {
    switch (answerLetter) {
        case 'A':
            return document.getElementById('answer-a');
        case 'B':
            return document.getElementById('answer-b');
        case 'C':
            return document.getElementById('answer-c');
        case 'D':
            return document.getElementById('answer-d');
        case 'N':
            return document.getElementById('question-next');
        case 'L':
            return document.getElementById('question-last');
    }
}

//gets the array index for the second index number in QUIZ_ARRAY by the answer letter
function getIndexByAnswer(answerLetter) {
    switch (answerLetter) {
        case 'A':
            return 1;
        case 'B':
            return 2;
        case 'C':
            return 3;
        case 'D':
            return 4;
    }
}

/**
 * Hide all pages
 */
function hideAllPages() {
    var startPage = document.getElementById('page-start');
    var questionsPage = document.getElementById('page-questions');
    var endPage = document.getElementById('page-end');

    startPage.style.display = 'none';
    questionsPage.style.display = 'none';
    endPage.style.display = 'none';
}

/**
 * Show start page
 */
function showStartPage() {
    var page = document.getElementById('page-start');

    hideAllPages();

    page.style.display = 'block';

    console.info('Je bent nu op de startpagina');
}

/**
 * Show questions page
 */
function showQuestionsPage() {
    var page = document.getElementById('page-questions');

    hideAllPages();

    page.style.display = 'block';

    document.getElementById("live-timer").innerText = "0:00";

    quizUpdate();

    quizTimer = Date.now();

    console.info('Je bent nu op de vragenpagina');

    //I said I would make this if I had time, and now that I don't have to worry about more user stories, I have time.
    //This function makes a timer at the top of the page display how much time the player has spent playing the quiz
    liveTimer = setInterval(function() {
	if (userAnswer.length == 10) {
	    clearInterval(liveTimer);
        } else if (timeTally < 3600) {
            timeTally++;
            document.getElementById("live-timer").innerText = tableTime(timeTally);
        } else if (timeTally = 3600) {
            timeTally++;
            document.getElementById("live-timer").innerText = "Meer dan een uur";
        }
    }, 1000);
}

/**
 * Show end page
 */
function showEndPage() {
    var page = document.getElementById('page-end');

    hideAllPages();

    page.style.display = 'block';

    getGrade();

    console.info('Je bent nu op de preview van de einde pagina');
}

/**
 * Check answer
 * @param response A character that corresponds to the button pressed
 */
function giveAnswer(response) {
    if (questionNumber == userAnswer.length) {
        userAnswer.push(response);
        console.info(response);
        getButton('N').style.opacity = 1;
        if (response == QUIZ_ARRAY[questionNumber][5]) {
            scoreTally++;
        }
        if (questionNumber == 9) {
            quizTimer = Date.now() - quizTimer;
            sendScore(studentObject, scoreTally, computeTime(quizTimer));
        }
        feedback();
    }
}


/**
 * Audiovisual feedback for answering
 */
function feedback() {
    //These colours are chosen for accessability for colourblind people
    var red = '#eda247ff';
    var green = '#57C4ADff';

    //set correct answer to green, if the user chose... poorly, set their answer to red
    if (QUIZ_ARRAY[questionNumber][5] != userAnswer[questionNumber]) {
        getButton(userAnswer[questionNumber]).style.background = red;
        getButton(userAnswer[questionNumber]).innerHTML = `<s>${QUIZ_ARRAY[questionNumber][getIndexByAnswer(userAnswer[questionNumber])]}</s>`;
    }
    getButton(QUIZ_ARRAY[questionNumber][5]).style.background = green;
    getButton(QUIZ_ARRAY[questionNumber][5]).innerHTML = `<strong>${QUIZ_ARRAY[questionNumber][getIndexByAnswer(QUIZ_ARRAY[questionNumber][5])]}</strong>`;
    document.getElementById("live-grade").innerText = `${scoreTally}/10 goed`;
}


/**
 * Update quiz page to change button colours or questions
 */
function quizUpdate() {
    switch (questionNumber) {
        case 9:
            getButton('N').innerText = "Einde Quiz";
            break;
        case 0:
            getButton('L').style.opacity = 0.5;
            break;
        default:
            getButton('N').innerText = "Volgende vraag";
            getButton('L').style.opacity = 1;
            break;
    }
    if (questionNumber == userAnswer.length) {
        getButton('N').style.opacity = 0.5;
    } else {
        getButton('N').style.opacity = 1;
    }
    document.getElementById("question-number").innerText = `Vraag ${questionNumber + 1}`;
    document.getElementById("question-text").innerText = QUIZ_ARRAY[questionNumber][0];
    document.getElementById("multimedia").src = QUIZ_ARRAY[questionNumber][6];
    getButton('A').innerHTML = QUIZ_ARRAY[questionNumber][1];
    getButton('B').innerHTML = QUIZ_ARRAY[questionNumber][2];
    getButton('C').innerHTML = QUIZ_ARRAY[questionNumber][3];
    getButton('D').innerHTML = QUIZ_ARRAY[questionNumber][4];

    getButton('A').style.background = '#ffffffff';
    getButton('B').style.background = '#ffffffff';
    getButton('C').style.background = '#ffffffff';
    getButton('D').style.background = '#ffffffff';
}

/**
 * Populates the endscreen with what the user did
 */
function getGrade() {
    document.getElementById("congrats-name").innerText = `Gefeliciteerd ${studentObject.firstName}, je hebt de quiz af!`;
    document.getElementById("grade").innerText = `Jij hebt ${scoreTally}/10 vragen goed beantwoord in ${shownTime(computeTime(quizTimer))}.`;
    document.getElementById("twitter").addEventListener("click", function() {
        window.open(
            `https://twitter.com/intent/tweet?text=Ik%20heb%20net%20een%20frontend%20development%20quiz%20afgemaakt%20met%20een%20score%20van%20${scoreTally}%20en%20een%20tijd%20van%20${shownTime(computeTime(quizTimer))}!`, "_blank");
    });
}


/**
 * Takes an input of seconds and transforms it into a human-readable format for this particular purpose
 * @param time Time in seconds
 */
function shownTime(time) {
    if (time < 60) {
        return `${time} seconden`;
    } else if (time == 3600) {
        return `meer dan een uur`;
    } else if (time % 60 === 0) {
        if (time / 60 == 1) {
            return "1 minuut";
        }
        return `${time / 60} minuten`;
    } else {
        if (Math.floor(time / 60 == 1)) {
            return `1 minuut en ${time % 60} seconden`;
        }
        return `${Math.floor(time / 60)} minuten en ${time % 60} seconden`;
    }
}

/**
 * Divides the time by 1000 to get seconds, and limits the range of possiblities to between 1 second and 1 hour
 */
function computeTime() {
    if (quizTimer < 1000) {
        return 1;
    }
    if (quizTimer > 3600000) {
        return 3600;
    } else {
        return Math.floor(quizTimer / 1000);
    }
}

/**
 * Check to see if the provided student number is valid using regex.
 * Regex breakdown:
 * ^ The first character
 * s is s
 * \d the same as writing [0-9] 
 * {7} for the next 7 characters 
 * $ the end of the string
 * So the first character is s followed by 7 digits and the end of the string
 * | logical or
 * The second half just replaces [s] with [A-Za-z]{2}, which checks if the first two characters are in the range A-Z or a-z
 * @param rawInput The input that will be checked to see if the student number is valid
 */
function processInput(rawInput) {
    if (/^s\d{7}$|^[A-Za-z]{2}\d{7}$/.test(rawInput)) {
        checkStudent(rawInput);
    } else {
        document.getElementById("input-error").innerText = "Ongeldige studentnummer!";
    }
}

/**
 * Check student number using the API
 */
function checkStudent(number) {
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function() {
        if (xHttp.readyState == XMLHttpRequest.DONE) {
            var response = JSON.parse(xHttp.response);
            if (xHttp.status == 200) {
                studentIdentificationSucces(response);
            } else {
                studentIdentificationFailed(response);
            }
        }
    };
    xHttp.onerror = function() {
        studentIdentificationFailed(xHttp.statusText);
    };
    xHttp.open("GET", "YOUR API HERE" + number, true);
    xHttp.send();
}

/**
 * Student is successfully identified
 */
function studentIdentificationSucces(student) {
    console.info(student); // Een Javascript-object met studentnummer, voornaam en achternaam

    studentObject = student;
    document.getElementById("input-error").innerText = '';
    document.getElementById("button-questions").style.opacity = 1;
    document.getElementById("button-questions").style.pointerEvents = "auto";
    document.getElementById("player-name").innerText = `${studentObject.firstName} ${studentObject.lastName}`;
}

/**
 * Student number is incorrect
 */
function studentIdentificationFailed(errorMessage) {
    console.error(errorMessage);

    document.getElementById("input-error").innerText = "Student niet gevonden!";
}

/**
 * Sends score of the player to the Quiz-API.
 * @param student Student number of player
 * @param points Points of player
 * @param time Time to complete
 */
function sendScore(student, points, time) {
    var xHttp = new XMLHttpRequest();

    xHttp.onreadystatechange = function() {
        if (xHttp.readyState == XMLHttpRequest.DONE) {
            if (xHttp.status == 200) {
                console.info("Score succesvol opgeslagen");
                document.getElementById("score-errors").innerText = "Score succesvol opgeslagen";
            } else {
                console.error("Score niet succesvol opgeslagen");
                document.getElementById("score-errors").innerText = "Score niet opgeslagen‽";
                alert("Score niet opgeslagen!");
            }
        }
    };

    xHttp.onerror = function() {
        console.error("Score niet succesvol opgeslagen");
    };

    xHttp.open("POST", "YOUR API HERE", true);
    xHttp.setRequestHeader('Content-Type', 'application/json');
    xHttp.send(JSON.stringify({
        quizMaster: QUIZMASTER,
        student: student,
        points: points,
        time: time
    }));
}

/**
 * A modified version of the checkStudent function, which requests the scores for the quiz.
 * Using this, it calls a function to fill in the high score table on the end screen.
 */
function getScores() {
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function() {
        if (xHttp.readyState == XMLHttpRequest.DONE) {
            var response = JSON.parse(xHttp.response);
            if (xHttp.status == 200) {
                fillScoreTable(getHighScore(response), response);
            } else {
                console.error("Highscores niet opgehaald");
            }
        }
    };
    xHttp.onerror = function() {
        console.error("Highscores niet opgehaald");
    };
    xHttp.open("GET", "YOUR API HERE" + QUIZMASTER, true);
    xHttp.send();
}

/**
 * Checks if entry is in the array. Returns true if it is, false if it isn't.
 * Apparantly this is something you can just call as a method in ecmascript 7
 * @param entry The index number of the currently checked item
 * @param array An array containing the index numbers of items that have been determined to be high scores
 */
function checkUsed(entry, array) {
    if (array[0] === undefined) {
        return false;
    }
    for (var i in array) {
        if (array[i] == entry) {
            return true;
        }
    }
    return false;
}

/**
 * Iterates through the scores object, checking to see if the current object has a higher score than the current known highest.
 * Failing that, if the scores are equal, but the new object has a faster time, that takes precedence.
 * This function could theoretically be faster using bubble sort on the object.
 * But that sounds like a lot of work for something that won't have to iterate over too many objects.
 * @param score An object containing the complete list of submitted scores
 */
function getHighScore(score) {
    var usedScores = [];
    var currentHighest = 19; //I scored 0 points with a time of 1 hour on 19, so everything should be better than that
    while (usedScores.length < 10) {
        for (var i in score) {
            if (!checkUsed(i, usedScores)) {
                if (score[currentHighest].points < score[i].points || currentHighest == usedScores[usedScores.length - 1]) {
                    currentHighest = i;
                } else if (score[currentHighest].points == score[i].points) {
                    if (score[currentHighest].time > score[i].time) {
                        currentHighest = i;
                    }
                }
            }
        }
        if (checkUsed(currentHighest, usedScores)) {
            break;
        }
        usedScores.push(currentHighest);
    }
    return usedScores;
}

function tableTime(time) {
    if (time == 3600) {
        return "1:00:00";
    } else if (time % 60 < 10) {
        return `${Math.floor(time / 60)}:0${time % 60}`;
    } else {
        return `${Math.floor(time / 60)}:${time % 60}`;
    }
}

/**
 * This function iterates through the score lists and fills in the table with the top 10 scores
 * @param highScoreIndex An array containing the index numbers of the high scores in order
 * @param highScoreContainer An object containing the complete list of submitted scores
 */
function fillScoreTable(highScoreIndex, highScoreContainer) {
    for (var i in highScoreIndex) {
        document.getElementById(`entry-${i}`).innerHTML = `<td>${highScoreContainer[highScoreIndex[i]].player.firstName} 
			${highScoreContainer[highScoreIndex[i]].player.lastName}</td>
			<td>${highScoreContainer[highScoreIndex[i]].points}</td>
			<td>${tableTime(highScoreContainer[highScoreIndex[i]].time)}`;
    }
}

// Initialize
addButtonActions();
showStartPage();
