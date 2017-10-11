var questionBank; //variable to hold current question and answer(s)

/***************************************************************************************************
 * model (MVC)
 */
/***************************************************************************************************
 * getTriviaQuestion
 * @params {category, difficultyLevel}
 * @returns: {Object} return question object with answers
 * creates object with question, answer, and guesses
 */
function Model(){
    this.playersInfo =[{},{}]; // player Object
    this.playerStats = [{},{}];
    this.getTriviaQuestion = function(category, difficultyLevel, callback){
        console.log('this ran');
        $.ajax({
            url: 'https://opentdb.com/api.php?amount=1&type=multiple',
            data:{
                category: category,
                difficulty: difficultyLevel
            },
            dataType: 'json',
            method: 'Post',
            success: function(data){
                console.log('success',data);
                console.log(data.results[0]);
                questionBank = data.results[0];
                callback(questionBank);
            },
            error: function(data){
                console.log('something went wrong', data)
            }
        });
    }
/***************************************************************************************************
 * searchYoutube
 * @params {string} string is question from question list
 * @returns: {URL} Youtube url with relevent material
 * creates a search on youtube from string and returns top video url
 */
    this.searchYoutube = function(string,callback){
        $.ajax({
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            dataType: 'json',
            data:{
                q: string,
                maxResults: 5,
                type: 'video',
                detailLevel: 'verbose'
            },
            method: 'Post',
            success: function(data){
                var YTResult = data.data;
                var YTKeys = Object.keys(YTResult);
                var videoId = YTResult[YTKeys[0]].id.videoId;
                console.log('YT success', data);
                console.log('YT first video id', YTResult[YTKeys[0]]);
                console.log('https://www.youtube.com/watch?v='+videoId);
                callback('https://www.youtube.com/watch?v='+videoId);
            },
            error: function(data){
                console.log('something went wrong with YT',data);
            }
        })
    }
/***************************************************************************************************
 * searchWikipedia
 * @params {string} string; either current question or possible answer
 * @returns: {URL} return wikipedia url
 * searches Wikipedia for relevent article and returns url of article
 */
    this.searchWikipedia = function(string,callback) {
        $.ajax({
            url: "https://en.wikipedia.org/w/api.php",
            data: {
                format: "json",
                action: "query",
                // page: string,
                prop: 'info',
                list: 'search',
                srsearch: string,
                // section: 0,
                origin: '*'
            },
            success: function (data) {
                console.log('Wiki success', data);
                callback('https://en.wikipedia.org/?curid='+data.query.search[0].pageid);
            },
            error: function (data) {
                console.log('wiki fail', data)
            }
        })
    }
/***************************************************************************************************
 * searchTwitter
 * @params {string}
 * @returns: {text} return text of most recent tweet
 * searches twitter for keywords and returns text of top tweet
 */
    this.searchTwitter = function(string,callback){
        $.ajax({
            url: 'http://s-apis.learningfuze.com/hackathon/twitter/index.php',
            data: {
                search_term: string
            },
            dataType: 'json',
            success: function(data){
                console.log('twitter success', data);
                console.log(data.tweets.statuses[0].text);
                callback(data.tweets.statuses[0].text);

            },
            error: function(data){
                console.log('twitter error', data)
            }
        })
    }
}

