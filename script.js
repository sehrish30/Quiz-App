/*-----------------------------------
         QUIZ CONTROLLER
------------------------------------*/
var quizController = (function () {
    //Question Constructor
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
    //    Setting local storage
    var questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection');
        }
    };

    //To prepare localStorage when page loads
    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }
    var quizProgress = {
        questionIndex: 0
    }
    
    /************PERSON CONSTRUCTOR********/
    function Person(id, firstname, lastname, score){
        this.id=id;
        this.firstname=firstname;
        this.lastname=lastname;
        this.score=score;
    }
    var currPersonData={
        fullname: [],
        score: 0
    }

    var adminFullName=['Sehrish' ,'Waheed'];
    var personLocalStorage={
        setPersonData: function(newPersonData){
            localStorage.setItem('personData', JSON.stringify(newPersonData))
        },

        getPersonData: function(){
            return JSON.parse(localStorage.getItem('personData'));
        },

        removePersonData: function(){
            localStorage.removeItem('personData');
        }
    };

    /**********Preparing local storage when loaded***********/
    if(personLocalStorage.getPersonData()===null){
        personLocalStorage.setPersonData([]);
    }
    return {
        getQuizProgress: quizProgress,
        getQuestionLocalStorage: questionLocalStorage,
        addQuestionOnLocalStorage: function (newQuestText, opts) {
            var isChecked, getStoredQuests, corrAns, questionId, newQuestion, optionsArr = [];
            isChecked = false;
            // decalre an array localstorage null in the beginning 
            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }

            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value != "") {
                    optionsArr.push(opts[i].value);
                }
                if (opts[i].previousElementSibling.checked && opts[i].value != "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }
            //  Get id for every question
            if (questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }
            //To avoid empty data being stored
            //Also checking if questions and options>1 should be filled
            if (newQuestText.value !== "" && optionsArr.length > 1 && isChecked === true) {

                newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
                getStoredQuests = questionLocalStorage.getQuestionCollection();
                getStoredQuests.push(newQuestion);

                //override existing ques
                questionLocalStorage.setQuestionCollection(getStoredQuests);

                document.getElementById("alert").style.visibility = "hidden";
                //Erase all the input fields once user inserts them
                newQuestText.value = "";
                for (var x = 0; x < opts.length; x++) {
                    opts[x].value = "";
                    opts[x].previousElementSibling.checked = false;
                }
                return true;
            } else {
                document.getElementById("alert").style.visibility = "visible";
                return false;
            }
        },
        checkAnswer: function(ans){
          if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer===ans.textContent){
            currPersonData.score++;  
            return true;
          }
          else{
              return false;
          }
        },
        isFinished: function(){
           return quizProgress.questionIndex+1===questionLocalStorage.getQuestionCollection().length;
        },
        addPerson: function(){
            let newPerson, personId, personData;
            if(personLocalStorage.getPersonData().length>0){
              personId= personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length-1].id+1;
            }
            else{
                personId=0;
            }
            newPerson=new Person(personId, currPersonData.fullname[0], 
                currPersonData.fullname[1], currPersonData.score);
                personData= personLocalStorage.getPersonData();//getting persons array
                personData.push(newPerson);
                personLocalStorage.setPersonData(personData);
                console.log(newPerson);
        },
        getCurrPersonData:currPersonData,
        getAdminFullName: adminFullName,
        getPersonLocalStorage: personLocalStorage,

    };

})();

/*-----------------------------------
         UI CONTROLLER
------------------------------------*/
var UIController = (function () {

    var domItems = {
        /**Admin panel Elements */
        adminPanelSection: document.querySelector(".admin-panel-container"),
        questInsertBtn: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestsWrapper: document.querySelector(".inserted-questions-wrapper"),
        questUpdateBtn: document.getElementById("question-update-btn"),
        questDeleteBtn: document.getElementById("question-delete-btn"),
        questClearBtn: document.getElementById("questions-clear-btn"),
        resultsListWrapper: document.querySelector(".results-list-wrapper"),
        clearResultsBtn: document.getElementById("results-clear-btn"),
        /***Quiz Section Elements ****/
        quizSection: document.querySelector('.quiz-container'),
        askedQuesText: document.getElementById("asked-question-text"),
        quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
        progressBar: document.querySelector("progress"),
        progressPara: document.getElementById('progress'),
        instAnsContainer: document.querySelector('.instant-answer-container'),
        instAnsText:document.getElementById('instant-answer-text'),
        instAnsDiv: document.getElementById('instant-answer-wrapper'),
        emotionicon: document.getElementById('emotion'),
        newQuestBtn: document.getElementById('next-question-btn'),
        /*********Landing PAge Elements***********/
        landingPageSection: document.querySelector('.landing-page-container'),
        startQuizBtn: document.getElementById("start-quiz-btn"),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
        /*********Final Result Section*******/
        finalResultSection: document.querySelector('.final-result-container'),
        finalScore: document.getElementById("final-score-text"),

    };

    return {
        getDomItems: domItems,
        addInputsDynamically: function () {
            var addInput = function () {
                var inputHTML, z;
                z = document.querySelectorAll('.admin-option').length;
                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + 'z' + '" name="answer" value="' + 'z' + '"><input type="text" class="admin-option admin-option-' + 'z' + '" value=""></div>';
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        createQuestionList: function (getQuestions) {
            var questHTML, numArray = [];
            domItems.insertedQuestsWrapper.innerHTML = "";
            for (let i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                numArray.push(i + 1);
                questHTML = ' <p><span>' + numArray[i] + '.' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '"st question">Edit</button></p>';
                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },
        editQuestList: function (event, storageQuestList, editinputsDynamically, updateQuesDynamically) {
            var getStorageQuestsList, getId, foundItem, placeInArr, optionHTML;
            //Getting the id of the element that pressed edit       
            if ('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1]);
                getStorageQuestsList = storageQuestList.getQuestionCollection();
                for (let i = 0; i < getStorageQuestsList.length; i++) {
                    if (getStorageQuestsList[i].id === getId) {
                        foundItem = getStorageQuestsList[i];
                        placeInArr = i;
                    }
                }
                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = '';
                optionHTML = '';
                for (let x = 0; x < foundItem.options.length; x++) {
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + foundItem.options[x] + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>'
                }
                domItems.adminOptionsContainer.innerHTML = optionHTML;
                editinputsDynamically();
                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questInsertBtn.style.visibility = 'hidden';
                domItems.questClearBtn.style.pointerEvents = "none";

                var backDefaultView = function () {
                    var updatedOptions;
                    updatedOptions = document.querySelectorAll('.admin-option');
                    domItems.newQuestionText.value = "";
                    for (let i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }
                    //Bring the UI back to previous display
                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    domItems.questDeleteBtn.style.visibility = 'hidden';
                    domItems.questInsertBtn.style.visibility = 'visible';
                    domItems.questClearBtn.style.pointerEvents = "";

                    //Invoke function and to pass createQuestionList parameter getQuestions 
                    updateQuesDynamically(storageQuestList);
                }

                var updateQuestion = function () {
                    var newOptions = [],
                        optionElem;
                    //Getting all the options to update when user clicks update btn
                    optionElem = document.querySelectorAll('.admin-option');

                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correctAnswer = "";
                    for (let i = 0; i < optionElem.length; i++) {
                        if (optionElem[i].value !== '') {
                            newOptions.push(optionElem[i].value);
                            if (optionElem[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionElem[i].value;
                            }
                        }
                    }
                    foundItem.options = newOptions;

                    if (foundItem.questionText != '' && foundItem.options.length > 1 && foundItem.correctAnswer !== '') {
                        getStorageQuestsList.splice(placeInArr, 1, foundItem);
                        //Now update questions localstorage
                        storageQuestList.setQuestionCollection(getStorageQuestsList);
                        backDefaultView();

                    } else {
                        document.getElementById("alert").style.visibility = "visible";
                    }
                }
                domItems.questUpdateBtn.onclick = updateQuestion;
                var deleteQuestion = function () {
                    getStorageQuestsList.splice(placeInArr, 1);
                    storageQuestList.setQuestionCollection(getStorageQuestsList);
                    backDefaultView();
                }
                domItems.questDeleteBtn.onclick = deleteQuestion;
            }
        },
        clearQuestionList: function (storageQuesList) {
            if (storageQuesList.getQuestionCollection() !== null) {
                if (storageQuesList.getQuestionCollection().length > 0) {
                    var conf = confirm("Warning you will lose");
                    if (conf) {
                        storageQuesList.removeQuestionCollection();
                        domItems.insertedQuestsWrapper.innerHTML = '';
                    }
                }
            }
        },
        displayQuestions: function (storageQuesList, progress) {
            let newOptionHTML, characterArray;
            characterArray = ['A', 'B', 'C', 'D', 'E', 'F'];
            if (storageQuesList.getQuestionCollection().length > 0) {
                domItems.askedQuesText.textContent = storageQuesList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizOptionsWrapper.innerHTML = '';
                for (let i = 0; i < storageQuesList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArray[i] + '</span><p  class="choice-' + i + '">' + storageQuesList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';
                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },
        displayProgress: function(storageQuesList, progress){
          domItems.progressBar.max=storageQuesList.getQuestionCollection().length;
          domItems.progressBar.value=progress.questionIndex+1;
          domItems.progressPara.textContent=(progress.questionIndex+1)+'/'+storageQuesList.getQuestionCollection().length;
        },
        newDesign: function(ansResult, selectedAns){
            let twoOptions, index=0;
            if(ansResult){
                index=1;
            }
            twoOptions={
                instAnsText: ['Incorrect Answer', 'Correct Answer'],
                instAnswerClass:['red', 'green'],
                emotionType:['images/sad.png', 'images/happy.png'],
                optionSpanBg: ['#B32432', '#115C1F']
            };
          domItems.quizOptionsWrapper.style.cssText="opacity: .6; pointer-events: none;";
          domItems.instAnsContainer.style.opacity="1";
          domItems.instAnsText.textContent=twoOptions.instAnsText[index];
          domItems.instAnsDiv.className=twoOptions.instAnswerClass[index];
          domItems.emotionicon.setAttribute('src', twoOptions.emotionType[index]);
          selectedAns.previousElementSibling.style.backgroundColor=twoOptions.optionSpanBg[index];
        },
        resetDesign: function(){
            domItems.quizOptionsWrapper.style.cssText="";
            domItems.instAnsContainer.style.opacity="0";
        },
        getFullName: function(currPerson, storageQuestionList, admin){
          if(domItems.firstNameInput.value!="" && domItems.lastNameInput.value!=""){
                if(!(domItems.firstNameInput.value===admin[0] && domItems.lastNameInput.value===admin[1])){
                    if(storageQuestionList.getQuestionCollection().length>0){
                        currPerson.fullname.push(domItems.firstNameInput.value);
                        currPerson.fullname.push(domItems.lastNameInput.value);
                        domItems.landingPageSection.style.display='none';
                        domItems.quizSection.style.display="block";
                    }
                    else{
                        document.querySelector('.alert-signin').style.visibility="visible";
                    }
                }
                else{
                    domItems.landingPageSection.style.display='none';
                    domItems.adminPanelSection.style.display="block";
                }
        }
        else{
            alert('Enter firstname and lastname');
        }
    },
    finalResult: function(currPerson){
        console.log(currPerson);
      domItems.finalScore.textContent=currPerson.fullname[0] + ' '+ currPerson.fullname[1]+', '+'Your Final Score is'+ ' '+ currPerson.score;
      domItems.quizSection.style.display="none";
      domItems.finalResultSection.style.display="block";
    },
    addResultOnPanel: function(userData){
       let resultHTML;
       domItems.resultsListWrapper.innerHTML='';
       for(let i=0; i< userData.getPersonData().length;i++){
           resultHTML='<p class="person person-'+i+'"><span class="person-'+i+'">'+userData.getPersonData()[i].firstname+' '+userData.getPersonData()[i].lastname+' - '+userData.getPersonData()[i].score+' Points</span><button id="delete-result-btn_'+userData.getPersonData()[i].id+'" class="delete-result-btn">Delete</button></p>';
           domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
       }
    },
    deleteResult: function(event, userData){
        let getId, personsArr;
        personsArr=userData.getPersonData();
      if('delete-result-btn_'.indexOf(event.target.id)){
          getId=parseInt(event.target.id.split('_')[1]);
           for(let i=0; i<personsArr.length; i++){
               if(personsArr[i].id===getId){
                   personsArr.splice(i, 1);
                   userData.setPersonData(personsArr);
               }
           }
      }
    },
    clearResultsList: function(userData){
       let conf;
       if(userData.getPersonData()!==null){
        if(userData.getPersonData().length>0){
            conf=confirm("Warning! you will lose entire list");
            if(conf){
                userData.removePersonData();
                domItems.resultsListWrapper.innerHTML='';
            }
       }
     }
    }
    };
})();

/*-----------------------------------
         MAIN CONTROLLER
------------------------------------*/
var controller = (function (quizCtrl, UICtrl) {
    var selectedDomItems = UICtrl.getDomItems;

    UIController.addInputsDynamically();
    UIController.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questInsertBtn.addEventListener('click', function () {
        var adminOptions = document.querySelectorAll('.admin-option'); //to ensure DOM is updated and removes items once insert button is clicked
        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
        if (checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
    });
    selectedDomItems.insertedQuestsWrapper.addEventListener('click', function (e) {
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
    });
    selectedDomItems.questClearBtn.addEventListener('click', function () {
        UICtrl.clearQuestionList(quizCtrl.getQuestionLocalStorage);
    });
    UICtrl.displayQuestions(quizController.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    UICtrl.displayProgress(quizController.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    
    selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e){
      let updatedOptionsDiv=selectedDomItems.quizOptionsWrapper.querySelectorAll('div');
      for(let i=0; i<updatedOptionsDiv.length; i++){
          if(e.target.className=== 'choice-' +i){
              var answer=document.querySelector('.quiz-options-wrapper div p.'+e.target.className);
              let ansResult=quizCtrl.checkAnswer(answer);
              UICtrl.newDesign(ansResult, answer);
              if(quizCtrl.isFinished()){
               selectedDomItems.newQuestBtn.textContent='End';
              }
              var nextQuestion= function(questionData, progress){
                  if(quizCtrl.isFinished()){
                      quizCtrl.addPerson();
                      UICtrl.finalResult(quizCtrl.getCurrPersonData);
                      console.log(quizCtrl.getCurrPersonData);
                  }else{
                      UICtrl.resetDesign();
                      quizCtrl.getQuizProgress.questionIndex++;
                      UICtrl.displayQuestions(quizController.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                      UICtrl.displayProgress(quizController.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                  }
              }
              selectedDomItems.newQuestBtn.onclick= function(){
                nextQuestion(quizCtrl.getQuestLocalStorage, quizCtrl.getQuizProgress);
              }
          }
      }
    });
    selectedDomItems.startQuizBtn.addEventListener('click', function(){
       UICtrl.getFullName(quizController.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
    });
    //Get inputs when user presses Enter Key enter =13
    selectedDomItems.lastNameInput.addEventListener('focus', function(){
       selectedDomItems.lastNameInput.addEventListener('keydown', function(e){
          if(e.keyCode===13){
            UICtrl.getFullName(quizController.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName); 
          }
       });
    });
    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    selectedDomItems.resultsListWrapper.addEventListener('click', function(e){
     UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
     UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    });
    selectedDomItems.clearResultsBtn.addEventListener('click', function(){
      UICtrl.clearResultsList(quizCtrl.getPersonLocalStorage);
    });

})(quizController, UIController);