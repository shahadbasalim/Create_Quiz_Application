let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let bullets = document.querySelector(".bullets");
let countdownElement = document.querySelector(".countdown");

//set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;

            //create bullets + set questions count
            createBullets(questionsCount);

            //add question data
            addQuestionsData(questionsObject[currentIndex], questionsCount);

            //start countdown
            countdown(90 , questionsCount);

            //click on submit button
            submitButton.onclick =  () => {
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                //increase index
                currentIndex++;
                //check the answer
                checkAnswer(theRightAnswer, questionsCount)

                //remove previous question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                //add question data
                addQuestionsData(questionsObject[currentIndex], questionsCount);

                //handle bullets class
                handleBullets();

                //start countdown again
                clearInterval(countdownInterval);
                countdown(90 , questionsCount);

                //show results
                showResults(questionsCount);
            }
        }
    }
    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    //create bullets
    for (let i = 0; i < num ; i++) {
        //create bullet
        let theBullet = document.createElement("span");
        
        if (i === 0 ) {
            theBullet.className = "on";
        }
        //append bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);
        
    }
}

function addQuestionsData(obj, count) {
    if (currentIndex < count) {
        //create question title
        let questionsTitle = document.createElement("h2");
        //create question text
        let questionsText = document.createTextNode(obj.title);
        questionsTitle.appendChild(questionsText);
        //append h2 to quiz area
        quizArea.appendChild(questionsTitle);

        //create the answers
        for (let i = 1 ; i <= 4 ; i++) {
            //create main answer div 
            let mainDiv = document.createElement("div"); // mainDiv = answer div in html
            mainDiv.className = "answer";

            //create Radio Input
            let RadioInput = document.createElement("input");
            RadioInput.name = "question";
            RadioInput.type = "radio";
            RadioInput.id = `answer_${i}`;
            RadioInput.dataset.answer = obj[`answer_${i}`];
            //make first option selected
            if (i === 1 ) {
                RadioInput.checked = true;
            }

            //create label 
            let theLabel = document.createElement("label");
            theLabel.htmlFor = `answer_${i}`;
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);        
            theLabel.appendChild(theLabelText);
            
            //append input and label to the main div
            mainDiv.appendChild(RadioInput);
            mainDiv.appendChild(theLabel);

            //append main div to answers area
            answersArea.appendChild(mainDiv);
        }   
    }
}

function checkAnswer(rAnswer, qCount) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0 ; i < answers.length ; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
        console.log("Good Answer");
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
};

function showResults(qCount) {
    let theResults;
    if (currentIndex === qCount) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (qCount / 2) && rightAnswers < qCount) {
            theResults = ` <span class="good">Good:</span> You Answered ${rightAnswers} From ${qCount} 👍`;
        } else if (rightAnswers === qCount) {
            theResults = ` <span class="perfect">Perfect:</span> You Answered ${rightAnswers} From ${qCount} 👏`;
        } else {
            theResults = ` <span class="bad">Bad:</span> You Answered ${rightAnswers} From ${qCount} 👎`;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.padding = "10px";  
    } 
}

function countdown(duration, qCount) {
    if (currentIndex < qCount) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;

            countdownElement.innerHTML = `${minutes} : ${seconds}`;
            
            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}