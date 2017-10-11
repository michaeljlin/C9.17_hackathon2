$(document).ready(initializeGame);

function initializeGame() {


    $('#answer1').click(view.pressAnswerButton);
    $('#answer2').click(view.pressAnswerButton);
    $('#answer3').click(view.pressAnswerButton);
    $('#answer4').click(view.pressAnswerButton);

    $('#submitName').click(view.setPlayerOneName);

    $('#option1').click(view.setAvatars);
    $('#option2').click(view.setAvatars);

    // view.setupButtons();
    view.setupNextQuestion();

    $('.btn').css({'outline': 'none'});

    $("#wiki").tooltip({title:'Search Wikipedia for help', placement: 'bottom'});
    $("#youtube").tooltip({title:'Ask Youtube for help', placement: 'bottom'});
    $("#twitter").tooltip({title:'Ask Twitter for help', placement: 'bottom'});

    $('[data-toggle="tooltip"]').tooltip();

    $(document).on('click', '#wiki', {type:'wiki'}, view.hintToggle);
    $(document).on('click', '#youtube', {type:'youtube'}, view.hintToggle);
    $(document).on('click', '#twitter', {type:'twitter'}, view.hintToggle);

    $(document).on('click', '#nextQuestionSubmit', null, view.getNextQuestion);

    $('#hint').on('hidden.bs.modal', view.clearModal);

    view.nextQuestion();

    // $('.btn').css({'outline': 'none'});
    //
    // $('[data-toggle="tooltip"]').tooltip();
}

function Game(){
    var self = this;
    this.hintHTML = null;

    this.categories = ['General Knowledge', 'Science & Nature', 'History', 'Geography', 'Celebreties', 'Animals', 'Sports', 'Books', 'Music', 'Film'];
    this.categoryNum = [9, 17, 23, 22, 26, 27, 21, 10, 12, 11];

    this.setAvatars = function(){
        var avatarSrc = $(this)[0].currentSrc;

        controller.getPlayerAvatar(avatarSrc);
        console.log(avatarSrc);

        // return $(this);
    };

    this.getNextQuestion = function(){
        console.log("Next question called!");

        var raw = $('.categoryOptionList').val();

        var number = self.categories.indexOf(raw);

        var catNum = self.categoryNum[number];

        var diff = $("input[name=difficultyLevel]:checked").val();

        var questionObject = {category:catNum, difficulty: diff};

        console.log("raw value: "+raw);
        console.log("index value: "+number);
        console.log("category number: "+catNum);
        console.log("difficulty: "+diff);

        // console.log('question object: '+$(questionObject));

        controller.setCurrentQuestionInModel(questionObject);

        $('#nextQuestion').modal('toggle');
    };

    this.refreshPage = function(nextTurnInfo){
        self.updateStatus(nextTurnInfo.status);
        self.updateQuestion(nextTurnInfo.question);
        self.updateAnswers(nextTurnInfo.answers);
    };

    this.updateStatus = function(turn, player1Points, player2Points){
        $('#turn').text(turn);
        $('#playerOnePoints').text(player1Points);
        $('#playerTwoPoints').text(player2Points);
    };

    this.updateQuestion = function(category, question){
        $('#questionCategory').text(category);
        $('#question').text(question);
    };

    this.updateAnswers = function(answerArray){
        for(var i = 0; i < 4 ; i++){
            $('#answer'+(i+1)+'Text').text(answerArray[i]);
        }
    };

    this.pressAnswerButton = function(){
        var chosenAnswer = $(this)[0].innerText.substr(0, $(this)[0].innerText.length-1);
        console.log(chosenAnswer);
        controller.answerButtonPressed(chosenAnswer);
    };

    this.setHintHTML = function(hintHTMLElement){
        self.hintHTML = hintHTMLElement;
    };

    this.clearModal = function(){

        $('#hintBody iframe').remove();
        $('.wikiContainer').remove();
        $('.tempTwitter').remove();

        if($('.mainHintContent').css('display') === 'none'){
            console.log('Showing mainHintContent!');
            $('.mainHintContent').toggle('hidden');
        }

        if($('#searchButton').css('display') === 'none'){
            $('#searchButton').toggle('hidden');
        }
    };

    this.setPlayerOneName = function(){
        var name = $('#setName').val();

        controller.getPlayerName(name);
        console.log(name);
    };

    this.showHint = function(){

    };

    this.setupNextQuestion = function(){
        for(var i = 0; i < self.categories.length; i++){
            var newOptionElement = new $('<option>').attr('data-category', self.categoryNum[i]).text(self.categories[i]);
            $('.categoryOptionList').append(newOptionElement);
        }
    };

    this.nextQuestion = function(){
        $('#nextQuestion').modal('toggle');
    };

    this.hintToggle = function(hint){
        switch(hint.data.type){
            case 'wiki':
                self.constructWikiHint();
                break;
            case 'youtube':
                self.constructYoutubeHint();
                break;
            case 'twitter':
                self.constructTwitterHint();
        }

        $('#hint').modal('toggle');
    };

    this.constructWikiHint = function(){
        $('#hintTitle').text('Wikipedia');
        $('#search').attr('value', $('#question').text() );
        $('#searchButton').attr('data-original-title', 'Use 3 points');

        var questionText = $('#question').text();

        model.searchWikipedia(questionText, model.getWikipediaText, function(result){
            // console.log('raw result data: '+result);

            var convertedHTML = new $('<div>').html(result);

            // console.log('converted html: '+$(convertedHTML));

            var wikiElementContainer = $('<div>').addClass('wikiContainer col-md-12');

            wikiElementContainer.html( $(convertedHTML).find('p') );

            $('#hintBody .row').append(wikiElementContainer);

            $('.wikiContainer a').attr(
                'href', 'https://en.wikipedia.org'+$('.wikiContainer a').attr('href')).attr(
                    'target', '_blank'
            );
        });
    };

    this.constructYoutubeHint = function(){
        $('#hintTitle').text('Youtube');
        $('.mainHintContent').toggle('hidden');
        $('#searchButton').toggle('hidden');

        var questionText = $('#question').text();

        console.log("Question was: "+questionText);

        model.searchYoutube(questionText, function(result){
            console.log('Searched youtube!');
            // $('#hintBody').append(result);

            var newIFrame = $('<iframe>').attr({
                'src':result,
                // 'width':'560px',
                // 'height':'315px'
                'height': '110%',
                'width': '100%'
            });

            $('#hintBody').css('height', '80%').append(newIFrame);
        });

        // $('#searchButton').attr('data-original-title', 'Use 2 points');
    };

    this.getUpperCase = function(string){
        var newStringArray = [];
        var wordCount = 0;
        var newString = '';
        newStringArray = string.split(' ');
        console.log(newStringArray);
        for(var i = 0; i<newStringArray.length; i++){
            for(var j = 0; j<1; j++){
                if(newStringArray[i][j].toUpperCase() == newStringArray[i][j]) {
                    newString += newStringArray[i]+"+"
                    wordCount ++
                    if(wordCount == 3){
                        return;
                    }
                }
            }
            console.log(newString);
        }
        return newString;
    }


    this.constructTwitterHint = function() {
        $('#hintTitle').text('Twitter');
        $('#search').attr('value', $('#question').text());
        $('#searchButton').attr('data-original-title', 'Use 1 point');

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

        questionText = this.getUpperCase(questionText);


        model.searchTwitter(questionText, model.getTwitterEmbed, function (result) {
            console.log('raw embed data: ' + result);
            $('.tempTwitter').html(result);
        });
    }

}

var view = new Game();

var controller = new Controller();

var model = new Model();