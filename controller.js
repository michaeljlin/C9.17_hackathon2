function Controller()
{
    this.playerOneName = null;
    this.playerTwoName = null;
    this.playerOneAvatar = null;
    this.playerTwoAvatar = null;
    this.playerOnePoint = 0;
    this.playerTwoPoint = 0;
    this.playerTurn = null;
    this.helpsArray = [{title:"youtube",quantities:3},{title:"wikipedia",numbers:3},{title:"pass",numbers:3}];
    this.help = null;

    this.setPlayerInfo = function(playerInfoArray){
        model.playersInfo[0].name = playerInfoArray[0].name;
        model.playersInfo[1].name = playerInfoArray[1].name;

        view.displayPlayerNameAndAvatars(model.playersInfo[0].name, model.playersInfo[1].name);
    };

    this.getHelpType = function(helpName)
    {
        switch (helpName)
        {
            case ("wiki"):
                this.help = 1;
                break;
            case("youtube") :
                this.help = 2;
                break;
            case("twitter") :
                this.help = 3;
                break;
        }
        this.help = helpName;
    };

    this.answerButtonPressed = function(chosenAnswerText){
        var currentTurn = model.playersInfo[2];

        if(chosenAnswerText === model.currentAnswer){
            this.pointing(currentTurn,questionBank.difficulty,this.help);
            model.correctAudioObject.play();
            view.setAnswerResult('correct', model.currentAnswer);
            console.log('Player '+ (currentTurn+1) + ' got the question correct! Toggling next question modal!');
            model.playersInfo[currentTurn].points+=1;
            this.changeCurrentTurn();
            view.setActivePlayerStatus(model.playersInfo[2]);
            view.updateStatus(model.playersInfo[2] + 1, model.playersInfo[0].points, model.playersInfo[1].points);
            view.nextQuestion();
        }
        else{
            model.wrongAudioObject.play();
            view.setAnswerResult('wrong', model.currentAnswer);
            console.log('Player '+ (currentTurn+1) + ' got the question wrong! Toggling next question modal!');
            this.changeCurrentTurn();
            view.setActivePlayerStatus(model.playersInfo[2]);
            view.updateStatus(model.playersInfo[2] + 1, model.playersInfo[0].points, model.playersInfo[1].points);
            view.nextQuestion();
        }
    };

    this.setCurrentQuestionInModel = function(questionObject){
        if(questionObject === undefined){

            return;
        }
        else{
            view.toggleMainQuizSection();

            model.getTriviaQuestion(questionObject.category, questionObject.difficulty, function(dataBank){

                // var quoteFix = questionBank.question.replace(/&quot;/g,'\"');
                // var apostFix = quoteFix.replace(/&#039;/g,'\"');

                var fixedIncorrectAnswers = [];

                for(var i = 0; i < dataBank.incorrect_answers.length; i++){
                    fixedIncorrectAnswers.push(he.decode(dataBank.incorrect_answers[i]));
                }

                model.setCurrentQuestion(he.decode(dataBank.question));
                model.setCurrentAnswer(he.decode(dataBank.correct_answer));
                model.setCurrentWrongAnswers(fixedIncorrectAnswers);
                model.setCurrentCategory(dataBank.category);
                model.setCurrentDifficulty(dataBank.difficulty);

                view.updateQuestion(model.currentCategory, model.currentQuestion);

                var temp = model.currentWrongAnswers.slice();
                temp.push(model.currentAnswer);

                for(var i = 0; i < temp.length; i++){
                    var randomPosition = Math.floor(Math.random()*(temp.length-1));
                    var hold = temp[i];
                    temp[i] = temp[randomPosition];
                    temp[randomPosition] = hold;
                }

                view.updateQuestionDiffPanel(model.currentDifficulty);
                view.updateAnswers(temp);
            });
        }
    };

    this.sanitizeText = function(rawString){
        var quoteFix = rawString.replace(/&quot;/g,'\"');
        var apostFix = quoteFix.replace(/&#039;/g,'\"');

        return apostFix;
    };

    this.getPlayerNameImage = function(turn,name,avatar)
    {
        if (turn === 1)
        {
            this.playerOneName = name;
            this.playerOneAvatar = avatar;
        }

        if (turn === 2)
        {
            this.playerTwoName = name;
            this.playerTwoAvatar = avatar;
        }
    };

    this.getPlayerName = function(avatarAddress)
    {
        model.getPlayerName(avatarAddress);
        this.changeCurrentTurn();

    };

    this.getPlayerAvatar = function(avatarAddress)
    {
        model.getPlayerAvatar(avatarAddress);
        this.changeCurrentTurn();

    };

    this.changeCurrentTurn = function()
    {
        model.playersInfo[2] = 1-model.playersInfo[2];
    };

    this.updateDomElements = function()
    {



    };

    this.askPlayerToSelectCategory = function()
    {
        var selectedQuestion = {};
        selectedQuestion.category = null;
        selectedQuestion.difficulty = null;
        return selectedQuestion;
    };

    this.questionSelectionButtonClicked = function()
    {
        var questionRequest = {};
        questionRequest.categoryId = this.id;
        questionRequest.difficultydata = this.data;
        return questionRequest;

    };

    this.UseHelps = function()
    {
        var help = null;
        for (var i=0; i < this.helpsArray; i++)
        {
            if ( help === this.helpsArray[i].title && this.helpsArray[i].quantities > 0)
            {
                this.helpsArray[i].quantities--;
                break;
            }

            if (this.helpsArray[i].quantities > 0)
            {
                alert("you can not this hint anymore");
            }
        }
    };




    this.checkTheAnswer = function(playerAnswer,realAnswer)
    {
        if (playerAnswer !== realAnswer)
        {
            return true;
        }

        return false;

    };

    this.pointing = function(turn,difficultylevel,help)
    {
        switch (difficultylevel)
        {
            case ("easy") :
                var difficultylevelNum = 1;
                break;
            case ("medium") :
                var difficultylevelNum = 2;
                break;
            case ("difficult") :
                var difficultylevelNum = 3;
                break;
        }
        if ( turn === 0 && (help === 0 || help === 3))
        {
            playerOnePoint += difficultylevelNum*10;
        }

        if ( turn === 0 && help === 1)
        {
            playerOnePoint += difficultylevelNum*10*.5;
        }

        if ( turn === 0 && help === 2)
        {
            playerOnePoint += difficultylevelNum*10*.75;
        }

        if ( turn === 1 && (help === 0 || help === 3))
        {
            playerTwoPoint += difficultylevelNum*10;
        }

        if ( turn === 1 && help === 1)
        {
            playerTwoPoint += difficultylevelNum*10*.5;
        }

        if ( turn === 1 && help === 2)
        {
            playerTwoPoint += difficultylevelNum*10*.75;
        }

        view.updateStatus(this.playerTurn, this.playerOnePoint, this.playerTwoPoint);
        model.updatePlayerInfo(this.playerOnePoint,this.playerTwoPoint);

    };





    this.questionSelection = function(viewData)
    {
        var questionInfo = {};
        questionInfo.category = viewData.categoryId;
        questionInfo.difficulty = viewData.difficultydata;
        return questionifo;

    };

    this.getAndPassPlayersInfo = function()
    {
        var playersInfo = [];



    };

    this.printQuestionAndAnswers = function()
    {
        var tempObj = modal.getTriviaQuestion();
        $("#question").text(tempObj.question);
        $("#answer1").text();
        $("#answer2").text();
        $("#answer3").text();
        $("#answer4").text();

    }


    this.getTheAnswer = function ()
    {
        this.checktheAnswer();
    };

    this.constructWikiHint = function(){

        $('#hintTitle').text('Wikipedia');

        view.prepareLoadingIcon();

        var questionText = $('#question').text();

        model.searchWikipedia(questionText, model.getWikipediaText, function(result){
            // console.log('raw result data: '+result);

            var convertedHTML = new $('<div>').html(result);

            // console.log('converted html: '+$(convertedHTML));

            var wikiElementContainer = $('<div>').addClass('wikiContainer col-md-11');

            view.removeLoadingIcon();
            wikiElementContainer.html( $(convertedHTML).find('p') );

            view.displayWikiHint(wikiElementContainer);

            // $('#hintBody .row').append(wikiElementContainer);
            //
            // $('.wikiContainer a').attr(
            //     'href', 'https://en.wikipedia.org'+$('.wikiContainer a').attr('href')).attr(
            //     'target', '_blank'
            // );
        });
    };

    this.constructYoutubeHint = function(){
        $('#hintTitle').text('Youtube');

        var questionText = $('#question').text();

        view.prepareLoadingIcon();

        console.log("Question was: "+questionText);

        model.searchYoutube(questionText, function(result){
            console.log('Searched youtube!');
            // $('#hintBody').append(result);

            var newIFrame = $('<iframe>').attr({
                'src':result+'?autoplay=1',
                // 'width':'560px',
                // 'height':'315px'
                'height': '110%',
                'width': '100%'
            });

            view.removeLoadingIcon();
            view.displayYoutubeHint(newIFrame);

            // $('#hintBody').css('height', '80%').append(newIFrame);
        });
    };

    this.randomThree = function(string){
        var newStringArray = [];
        var wordCount = 0;
        var newString = '';
        newStringArray = string.split(' ');
        console.log(newStringArray);

        for(var i = 0; i < 3; i++){
            newString += newStringArray[Math.floor(Math.random()*(newStringArray.length-1) )];

            if(i !== 2){
                newString+='+';
            }
        }

        return newString;
    };

    this.constructTwitterHint = function() {
        $('#hintTitle').text('Twitter');

        view.prepareLoadingIcon();

        var questionText = $('#question').text();

        var answerString = "";

        for (var i = 0; i < model.currentWrongAnswers.length; i++) {
            answerString += model.currentWrongAnswers[i] + " ";
        }

        answerString += model.currentAnswer;

        console.log('answer string is: ' + answerString);

        // console.log("Question was: "+questionText);

        var tempTwitterElement = new $('<div>').addClass('tempTwitter col-md-6 col-md-offset-4');

        $('.outerHintContent').append(tempTwitterElement);

        questionText = this.randomThree(questionText);


        model.searchTwitter(questionText, model.getTwitterEmbed, function (result) {
            console.log('raw embed data: ' + result);

            view.removeLoadingIcon();
            view.displayTwitterHint(result);


            // $('.tempTwitter').html(result);
        });
    }


}

