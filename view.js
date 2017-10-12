/***********************************************************************************************************************
*   Listen for the document to load and initialize the game
 */
$(document).ready(initializeGame);

/***********************************************************************************************************************
 *   Global variables defined here.
 */

var view = new Game();
var controller = new Controller();
var model = new Model();

/***********************************************************************************************************************
*   initializeGame - Initializes the game by calling on the setupGame function in the view object
 *   @params: {undefined} none
 *   @returns: {undefined} none
 */

function initializeGame() {

    view.setupGame();

    // view.setupNextQuestion();
    // $('.playerOneStatusBox').addClass('activePlayer');
    // $('.btn').css({'outline': 'none'});
    //
    // $('#setPlayers').modal('toggle');
    // $('.mainHintContent').toggle('hidden');
    // $('#searchButton').toggle('hidden');
    //
    // $('#answer1').click(view.pressAnswerButton);
    // $('#answer2').click(view.pressAnswerButton);
    // $('#answer3').click(view.pressAnswerButton);
    // $('#answer4').click(view.pressAnswerButton);
    //
    // $('#setPlayerInfo').click(view.setPlayerInfo);
    //
    // $(document).on('click', '#wiki', {type:'wiki'}, view.hintToggle);
    // $(document).on('click', '#youtube', {type:'youtube'}, view.hintToggle);
    // $(document).on('click', '#twitter', {type:'twitter'}, view.hintToggle);
    // $(document).on('click', '#nextQuestionSubmit', null, view.getNextQuestion);
    //
    // $("#wiki").tooltip({title:'Search Wikipedia for help', placement: 'bottom'});
    // $("#youtube").tooltip({title:'Ask Youtube for help', placement: 'bottom'});
    // $("#twitter").tooltip({title:'Ask Twitter for help', placement: 'bottom'});
    // $('[data-toggle="tooltip"]').tooltip();
    //
    // $('#hint').on('hidden.bs.modal', view.clearModal);
    // $('#setPlayers').on('hidden.bs.modal', view.triggerInstructions);
    // $('#instructions').on('hidden.bs.modal', view.nextQuestion);
    // $('#nextQuestion').on('hidden.bs.modal', view.removeAnswerResult);
}

function Game(){
    var self = this;
    this.hintHTML = null;
    this.trackSetTimeout = null;

    // this.categories = ['General Knowledge', 'Science & Nature', 'History', 'Geography', 'Celebreties', 'Animals', 'Sports', 'Books', 'Music', 'Film'];
    // this.categoryNum = [9, 17, 23, 22, 26, 27, 21, 10, 12, 11];


    /*******************************************************************************************************************
     *   setupGame - Initializes the game by setting up basic view information and starting the player name entry modal.
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: setupNextQuestion, setupClickHandlers, setupTooltips, setupModalChain
     */
    this.setupGame = function(){
        self.setupNextQuestion();
        $('.playerOneStatusBox').addClass('activePlayer');
        $('.btn').css({'outline': 'none'});

        $('#setPlayers').modal('toggle');

        $('.mainHintContent').toggle('hidden');
        $('#searchButton').toggle('hidden');

        self.setupClickHandlers();
        self.setupTooltips();
        self.setupModalChain();
    };

    /*******************************************************************************************************************
     *   setupClickHandlers - Attaches click handlers to all buttons in document window
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: none
     */
    this.setupClickHandlers = function(){
        $('#answer1').click(view.pressAnswerButton);
        $('#answer2').click(view.pressAnswerButton);
        $('#answer3').click(view.pressAnswerButton);
        $('#answer4').click(view.pressAnswerButton);

        $('#setPlayerInfo').click(view.setPlayerInfo);

        $(document).on('click', '#wiki', {type:'wiki'}, view.hintToggle);
        $(document).on('click', '#youtube', {type:'youtube'}, view.hintToggle);
        $(document).on('click', '#twitter', {type:'twitter'}, view.hintToggle);
        $(document).on('click', '#nextQuestionSubmit', null, view.getNextQuestion);
    };

    /*******************************************************************************************************************
     *   setupTooltips - Attaches tooltups to hings
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: none
     */
    this.setupTooltips = function(){
        $("#wiki").tooltip({title:'Search Wikipedia for help', placement: 'bottom'});
        $("#youtube").tooltip({title:'Ask Youtube for help', placement: 'bottom'});
        $("#twitter").tooltip({title:'Ask Twitter for help', placement: 'bottom'});
        $('[data-toggle="tooltip"]').tooltip();
    };

    /*******************************************************************************************************************
     *   setupModalChain - Connects functions to modal close/hidden events
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: none
     */
    this.setupModalChain = function(){
        $('#hint').on('hidden.bs.modal', view.clearModal);
        $('#setPlayers').on('hidden.bs.modal', view.triggerInstructions);
        $('#instructions').on('hidden.bs.modal', view.nextQuestion);
        $('#nextQuestion').on('hidden.bs.modal', view.removeAnswerResult);
    };

    /*******************************************************************************************************************
     *   triggerInstructions - Switch instruction modal on/off
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: none
     */
    this.triggerInstructions = function(){
        $('#instructions').modal('toggle');
    };

    /*******************************************************************************************************************
     *   timeRunOutTrigger - Function callback for optional timers
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: controller.answerButtonPressed
     */
    this.timeRunOutTrigger = function(){
        console.log('Timeout has been triggered!');
        controller.answerButtonPressed('Time has run out!');
    };

    /*******************************************************************************************************************
     *   timerCountdown - Initiates a question timer that will end the current question round in 15 seconds
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: timeRunOutTrigger
     */
    this.timerCountdown = function(){
        console.log('Timer has started!');
        self.trackSetTimeout = setTimeout(self.timeRunOutTrigger, 15000);
    };

    /*******************************************************************************************************************
     *   clearTimer - Ends the current timer by clearing the local variable trackSetTimeout
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: none
     */
    this.clearTimer = function(){
        clearTimeout(self.trackSetTimeout);
    };

    /*******************************************************************************************************************
     *   setActivePlayerStatus - Changes the status box by adding or removing the class activePlayer
     *   @params: {int} playerTurn - The current turn
     *   @returns: {undefined} none
     *   @calls: none
     */
    this.setActivePlayerStatus = function(playerTurn){

        if(playerTurn === 0){
            $('.playerOneStatusBox').addClass('activePlayer');
            $('.playerTwoStatusBox').removeClass('activePlayer');
        }
        else {
            $('.playerOneStatusBox').removeClass('activePlayer');
            $('.playerTwoStatusBox').addClass('activePlayer');
        }
    };

    /*******************************************************************************************************************
     *   setAnswerResult - Sets the answer results in the #nextQuestion modal
     *   @params: {string} result - String indicating either correct or incorrect
     *   @params: {string} correctAnswer - A string that is the correct answer
     *   @returns: {undefined} none
     *   @calls: none
     */
    this.setAnswerResult = function(result, correctAnswer){
        var resultIconElement = new $('<span>');
        var answerElement = new $('<span>').text(correctAnswer).css({
            'background-color': 'black',
            'color': 'black'
        }).addClass('highlightText');
        var answerElementHolder = new $('<div>').text('The correct answer was: ').append(answerElement).addClass('answerIcon answerText col-md-5 col-md-offset-3');

        if(result === 'correct'){
            resultIconElement.addClass('answerIcon col-md-1 col-md-offset-5 glyphicon glyphicon-ok').css({
                'font-size':'70px',
                'color': 'green'
            });
        }
        else{
            resultIconElement.addClass('answerIcon col-md-1 col-md-offset-5 glyphicon glyphicon-remove').css({
                'font-size':'70px',
                'color': 'red'
            });
        }

        $('#nextQuestionBody .container .row').prepend(resultIconElement).prepend(answerElementHolder);
        $('.hintButton').removeClass('disabled');
    };

    /*******************************************************************************************************************
     *   removeAnswerResult - Removes the answer results after the #nextQuestion modal is closed
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: none
     */
    this.removeAnswerResult = function(){
        $('.answerIcon').remove();
    };

    /*******************************************************************************************************************
     *   setPlayerInfo - Sets the usernames based on the #setPlayers modal input, defaults to Player 1 & if
     *   input is empty
     *
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: controller.setPlayerInfo
     */
    this.setPlayerInfo = function(){
        var name1 = $('#username1').val();
        var name2 = $('#username2').val();
        if(name1 === ""){
            name1 = 'Player 1'
        }

        if(name2 === ""){
            name2 = 'Player 2'
        }

        var playerObject = [{
            name: name1
        },{
            name: name2
        }];
        controller.setPlayerInfo(playerObject);
    };

    /*******************************************************************************************************************
     *   getNextQuestion - Grabs the input from the #nextQuestion modal and converts it to usable data to be passed to
     *   the controller. Defaults to medium difficulty and General Knowledge category.
     *
     *   @params: {undefined} none
     *   @returns: {undefined} none
     *   @calls: clearQuestionDiffPanel, controller.setCurrentQuestionInModel
     */
    this.getNextQuestion = function(){

        if($('#mainScreen').css('display') === 'none'){
            $('#mainScreen').toggle('hidden');
        }

        var raw = $('.categoryOptionList').val();
        var number = model.categories.indexOf(raw);

        var catNum = model.categoryNum[number];

        var diff = $("input[name=difficultyLevel]:checked").val();

        if(number === -1){
            catNum = 9;
        }

        if(diff === undefined){
            diff = 'medium';
        }
        var questionObject = {category:catNum, difficulty: diff};

        console.log("raw value: "+raw);
        console.log("index value: "+number);
        console.log("category number: "+catNum);
        console.log("difficulty: "+diff);

        self.clearQuestionDiffPanel();

        controller.setCurrentQuestionInModel(questionObject);

        $('#nextQuestion').modal('toggle');

        // Uncomment next line if a time limit for guessing questions is needed
        // self.timerCountdown();
    };

    /*******************************************************************************************************************
     *   clearQuestionDiffPanel - Clears the panel difficulty indicator
     *   @params: {undefined} none
     *   @returns: {undefined} none
     */
    this.clearQuestionDiffPanel = function(){
        $('#questionBody').removeClass('panel-info panel-warning panel-danger panel-success');
    };

    /*******************************************************************************************************************
     *   updateQuestionDiffPanel - Updates the question panel with a bootstrap class based on the current difficulty
     *
     *   @params: {undefined} none
     *   @returns: {undefined} none
     */
    this.updateQuestionDiffPanel = function(diff){
        switch(diff){
            case 'easy':
                $('#questionBody').addClass('panel-success');
                break;
            case 'medium':
                $('#questionBody').addClass('panel-warning');
                break;
            case 'hard':
                $('#questionBody').addClass('panel-danger');
                break;
        }
    };

    this.refreshPage = function(nextTurnInfo){
        self.updateStatus(nextTurnInfo.status);
        self.updateQuestion(nextTurnInfo.question);
        self.updateAnswers(nextTurnInfo.answers);
    };

    this.displayPlayerNameAndAvatars = function(player1Name, player2Name){
        $('#playerOneName').text(player1Name);
        $('#playerTwoName').text(player2Name);
        $('#setPlayers').modal('toggle');
    };

    this.updateStatus = function(turn, player1Points, player2Points){
        $('#turn').text('Player '+turn);
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
        self.toggleMainQuizSection();
    };

    this.toggleMainQuizSection = function(){
        $('article').toggle('hidden');
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
        self.removeLoadingIcon();
    };

    this.showHint = function(){

    };

    this.setupNextQuestion = function(){
        for(var i = 0; i < model.categories.length; i++){
            var newOptionElement = new $('<option>').attr('data-category', model.categoryNum[i]).text(model.categories[i]);
            $('.categoryOptionList').append(newOptionElement);
        }
    };

    this.nextQuestion = function(){

        $('#nextQuestion').modal('toggle');
    };

    this.hintToggle = function(hint){
        switch(hint.data.type){
            case 'wiki':
                controller.constructWikiHint();
                controller.getHelpType("wiki");
                break;
            case 'youtube':
                controller.constructYoutubeHint();
                controller.getHelpType("youtube");
                break;
            case 'twitter':
                controller.constructTwitterHint();
                controller.getHelpType("twitter");
        }

        $('.hintButton').addClass('disabled');

        $('#hint').modal('toggle');
    };

    this.displayWikiHint = function(wikiElementContainer){
        $('#hintBody .row').append(wikiElementContainer);

        $('.wikiContainer a').attr(
            'href', 'https://en.wikipedia.org'+$('.wikiContainer a').attr('href')).attr(
            'target', '_blank'
        );
    };

    this.displayYoutubeHint = function(newIFrame){
        $('#hintBody').css('height', '80%').append(newIFrame);
    };


    this.displayTwitterHint = function(result){
        $('.tempTwitter').html(result);
    };

    this.prepareLoadingIcon = function(){
        var bootstrapElementHolder = $('<div>').addClass('spinHolder col-md-1 col-md-offset-5');
        var loadingIcon = $('<i>').addClass("fa fa-spinner fa-spin").css('font-size', '200px');

        bootstrapElementHolder.append(loadingIcon);

        $('#hintBody .container .row').append(bootstrapElementHolder);
    };

    this.removeLoadingIcon = function(){
        $('.spinHolder').remove();
    };
}