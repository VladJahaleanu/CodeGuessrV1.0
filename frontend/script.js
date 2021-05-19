const body = document.getElementById('add_button_modal');

const formLanguage = document.getElementById('formLanguage');
const formImgUrl = document.getElementById('formImgUrl');

let saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');

let addButton = document.createElement('button');
// Add event on add button
addButton.addEventListener('click', openAddModal);
addButton.textContent = " + Add a code snippet";
body.appendChild(addButton);
addButton.classList.add("animatedButton");
addButton.classList.add("add_button");

var data1;
var languages = ["C++", "Python", "Objective-C", "JavaScript", "Mindfuck", "Lua", "Swift", "Java", "SQL", "R", "Shell", "PHP", "Dart", "HTML"];
var correctLanguage;
var points = 0;
var rightNumberIndex;
var numberOfGists = 18;

const codeSnippet = document.getElementById("code_snippet");
const answers = document.getElementById("answers");
const next = document.getElementById("bottom");
const retry = document.getElementById("final_score");

fetch('http://localhost:3000/gists')
  .then(
    function (response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function (data) {
        console.log(data);
        data1 = data;
        renderGists(data);
      });
    }
  )
  .catch(function (err) {
    console.log('Fetch Error :-S', err);
  });

function renderGists (gists) {


refresh();
}

// Add article
function addGistToServer() {
    // creat post object
    const postObject = {
        "language": formLanguage.value,
        "src": formImgUrl.value,
    }
    // Call post request to add a new article
    fetch('http://localhost:3000/gists', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        // Get the new article list
        renderGists();

        numberOfGists++;

        // Reset Form
        resetForm();

        // Close Modal
        closeModal();
    });
}





function getGist() {
    let randomNumber = getRandomInt(numberOfGists);

    createAndRenderGist(data1[randomNumber]);

    correctLanguage = data1[randomNumber].language;

}

function createAndRenderGist(gist) {
    //   Create
    const img = document.createElement('img');
    img.setAttribute("src", gist.src);
    img.setAttribute('id', 'gist');
    img.classList.add('roundedImg');

    //  Render
    codeSnippet.innerText = '';
    codeSnippet.appendChild(img);


}

function getAnswersButtons() {
    
    answers.innerText = '';
    var idx = 0;

    //   Create
    const { randomAnswers, rightNumberIndex } = generateAnswers();

    randomAnswers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.setAttribute('class', 'buton_rasp');
        button.setAttribute('class', 'animatedButton');
        button.setAttribute('id', 'buton'+idx);
        button.innerText = answer;
        if (index === rightNumberIndex) {
            button.addEventListener('click', function() {
                //button.classList.add("buton_success");
                button.classList.remove("animatedButton");
                button.classList.add("apasatBun");
                success();
            })
        } else {
            button.addEventListener('click', function() {
                button.classList.remove("animatedButton");
                button.classList.add("apasatProst");
                for (let i = 0; i < randomAnswers.length; i++){
                    if(i === rightNumberIndex){
                        const correctButton = document.getElementById('buton'+i);
                        correctButton.classList.remove("animatedButton");
                        correctButton.classList.add("apasatBun");
                    }
                }

                
                fail();
            })
        }
        idx++;
        answers.appendChild(button);

    });
    

}

function generateAnswers() {
    let randomAnswers = [];

    while (randomAnswers.length != 4) {
        var randomAns = languages[getRandomInt(languages.length - 1)];
        if (!randomAnswers.includes(randomAns) && randomAns != correctLanguage) {
            randomAnswers.push(randomAns);
        }
    }

    rightNumberIndex = getRandomInt(randomAnswers.length);

    randomAnswers[rightNumberIndex] = correctLanguage;

    return { randomAnswers, rightNumberIndex };

}


function refresh() {

    getGist();

    getAnswersButtons();

    console.log(correctLanguage);

}



function success() {
    points += 10;
    document.getElementById("top_score_number_id").textContent = points;
    const buttonNext = document.createElement('button');
    buttonNext.innerText = 'Next';
    //buttonNext.setAttribute('class', 'buton_next');
    buttonNext.setAttribute('class', 'animatedButton');

    next.appendChild(buttonNext);

    buttonNext.addEventListener('click', function (){
        next.removeChild(buttonNext);
        refresh();
        
    });

}

function fail() {
    const spanNumber = document.createElement('span');
    spanNumber.textContent = points;
    spanNumber.setAttribute('class', 'final_score_number');

    const spanText = document.createElement('span');
    spanText.textContent = ' Points';
    spanText.setAttribute('class', 'final_score_text');

    retry.appendChild(spanNumber);
    retry.appendChild(spanText);

    const finalText = document.createElement('p');
    finalText.innerText = 'Better luck next time!';
    finalText.setAttribute('class', 'end_text');

    retry.appendChild(finalText);
    
    const buttonRetry = document.createElement('button');
    buttonRetry.innerText = 'Retry';
    buttonRetry.setAttribute('class', 'buton_retry');
    buttonRetry.setAttribute('class', 'animatedButton');
    
    next.appendChild(buttonRetry);

    buttonRetry.addEventListener('click', function(){
        points = 0;
        document.getElementById("top_score_number_id").textContent = points;
        retry.removeChild(spanNumber);
        retry.removeChild(spanText);
        retry.removeChild(finalText);
        next.removeChild(buttonRetry);
        refresh();
    })


}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function resetForm() {
    formLanguage.value = '';
    formImgUrl.value = '';
}

function openAddModal() {

    // clear all events save button events
    clearSaveButtonEvents();

    saveButton.addEventListener('click', function () {
        addGistToServer();
    });

    body.className = 'show-modal';
}

function closeModal() {
    body.className = '';
}

function clearSaveButtonEvents() {
    let newUpdateButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newUpdateButton, saveButton);
    saveButton = document.getElementById('save');
}

cancelButton.addEventListener('click', closeModal);



//refresh();

