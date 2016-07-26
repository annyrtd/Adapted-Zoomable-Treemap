class TALibrary extends TAConfig{
    //Globals
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var confirmit: ConfirmitFacade;
    static var user: User;
    static var state: ReportState;

    static var questions = [];
    static var currentQuestion: TAQuestion;

    /**
     * function to configure TA variables and set globals to libraries
     * @param {Logger} l - log
     * @param {Report} r - report
     * @param {ConfirmitFacade} c - confirmit
     * @param {User} u - user
     */
    static function setReport(context){
        var question: TAQuestion;
      	setGlobals(context);
      	log.LogDebug('here');

        if(!currentQuestion){
            context.log.LogDebug("setReportAgain");
            
            for(var i = 0 ; i<TAQuestions.length; i++){
                question = new TAQuestion(context, TAQuestions[i]);
                questions.push(question);
            }

            currentQuestion = questions[0];
        }
    }

    /**
     * function to transfer globals to libraries
     * @param {Report} r - report
     * @param {ConfirmitFacade} c - confirmit
     * @param {User} u - user
     */
  	static function setGlobals(context: Object){
        pageContext = context.pageContext;
        log = context.log;
        report = context.report;
        confirmit = context.confirmit;
        user = context.user;
      	state = context.state;

        try{
            TATableData.setGlobals(context);
        } catch(e) {
            log.LogDebug("There is no TATableData Class. " + e);
        }          
          
        try{
            TAParameterUtils.setGlobals(context);
        } catch(e) {
            log.LogDebug("There is no TAParameterUtils Class. " + e);
        }
      
      	try{
            TAFilterUtils.setGlobals(context);
        }catch(e){
            log.LogDebug("There is no TAFilterUtils Class. "+e);
        }
      
     	try{
            ZoomableTreemap.setGlobals(context);
        }catch(e){
            log.LogDebug("There is no ZoomableTreemap Class. "+e);
        }
      
      	try{
            DetailedAnalysis.setGlobals(context);
        }catch(e){
            log.LogDebug("There is no DetailedAnalysis Class. "+e);
        }
    }

    /**
     * function to set current TA question
     * @param {Byte} i - question number in TAConfig
     */
    static function setCurrentQuestion(i){
     	if(!i || i>=questions.length || i < 0){
            currentQuestion = questions[0];
        }else{
            currentQuestion = questions[i];
        }
    }
}