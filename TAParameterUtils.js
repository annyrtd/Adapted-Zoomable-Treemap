class TAParameterUtils{
    //Globals
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var confirmit: ConfirmitFacade;
    static var user: User;
  	static var state: ReportState;

    /**
     * @param {Logger} l - log
     * @param {Report} r - report
     * @param {ReportState} s - state
     * @param {ConfirmitFacade} c - confirmit
     * @param {User} u - user
     */
  	static function setGlobals(context: Object) {            
      	log = context.log;
    	state = context.state;
      	pageContext = context.pageContext;
        report = context.report;
        confirmit = context.confirmit;
        user = context.user;   
    }

    /**
     * domain script to get list of top TA categories
     * @param {Parameter} paramrter - parameter object
     * @param {Byte} questionID - question number in TAConfig
     */
    static function createThemesListParameter(parameter: Parameter){
        var parameterVal: ParameterValueResponse;
        var question: TAQuestion;

        question = TALibrary.currentQuestion;

        for(var i=0; i<question.themes.length; i++)
        {
            parameterVal = new ParameterValueResponse();
            parameterVal.StringValue = question.themes[i].name;
            parameterVal.StringKeyValue = question.themes[i].id;
            parameter.Items.Add(parameterVal);
        }
    }

    /**
     * domain script to get list of TA subcategories
     * @param {Parameter} parameter - parameter object
     * @param {Byte} questionID - question number in TAConfig
     */
    static function createSubcategoriesListParameter(parameter: Parameter){
        var parameterVal: ParameterValueResponse;
        var question: TAQuestion;

        question = TALibrary.currentQuestion;

        for(var i=0; i<question.subcategories.length; i++)
        {
            parameterVal = new ParameterValueResponse();
            parameterVal.StringValue = question.subcategories[i].name;
            parameterVal.StringKeyValue = question.subcategories[i].id;
            parameter.Items.Add(parameterVal);
        }
    }

    /**
     * mask script to get list of TA subcategories of selected category
     * @param {ParameterMaskString} parameter - parameter object
     */
    static function getSubcategoriesMask(mask: ParameterMaskString) {
        if (TALibrary.currentQuestion.currentTheme >= 0) {
            mask.Access = ParameterAccessType.Inclusive;
            for (var i = 0; i < TALibrary.currentQuestion.themes[TALibrary.currentQuestion.currentTheme].children.length; i++)
                mask.Keys.Add(TALibrary.currentQuestion.themes[TALibrary.currentQuestion.currentTheme].children[i].id);
        }
    }

    /**
     * domain script to get list of TA attributes
     * @param {Parameter} parameter - parameter object
     * @param {Byte} questionID - question number in TAConfig
     */
    static function createAttributesListParameter(parameter: Parameter,questionID){
        var parameterVal: ParameterValueResponse;
        var question: TAQuestion;

        question = TALibrary.currentQuestion;

        for(var i=0; i<question.attributes.length; i++)
        {
            parameterVal = new ParameterValueResponse();
            parameterVal.StringValue = question.attributes[i].name;
            parameterVal.StringKeyValue = question.attributes[i].id;
            parameter.Items.Add(parameterVal);
        }
    }

    /**
     * mask script to get list of TA attributes of selected category
     * @param {ParameterMaskString} parameter - parameter object
     */
    static function getAttributesMask(mask: ParameterMaskString) {
        if (TALibrary.currentQuestion.currentSubcategory >= 0) {
            mask.Access = ParameterAccessType.Inclusive;
            for (var i = 0; i < TALibrary.currentQuestion.subcategories[TALibrary.currentQuestion.currentSubcategory].children.length; i++)
                mask.Keys.Add(TALibrary.currentQuestion.subcategories[TALibrary.currentQuestion.currentSubcategory].children[i].id);
        }
    }

}