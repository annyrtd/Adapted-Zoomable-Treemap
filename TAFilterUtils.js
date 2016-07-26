class TAFilterUtils{
    //Globals
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var state: ReportState;
    static var confirmit: ConfirmitFacade;
    static var user: User;

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
     * current theme filter
     * @param filter
     */
    static function currentCategoryFilter(filter){
        var categoryParameter = TALibrary.currentQuestion.questionDetails.TACategoryListParameter;    
        var subCategoryParameter = TALibrary.currentQuestion.questionDetails.TASubcategoryListParameter;    
        var attributesParameter = TALibrary.currentQuestion.questionDetails.TAAttributesListParameter;
        
        filter.Expression = '';
        
        var expr = '';
        var value = '';
        
        if(!state.Parameters.IsNull(attributesParameter)) {
          	value = state.Parameters.GetString(attributesParameter);  
        } else {
            if(!state.Parameters.IsNull(subCategoryParameter)) {
                value = state.Parameters.GetString(subCategoryParameter);
            } else {
                if(!state.Parameters.IsNull(categoryParameter)) {
                    value = state.Parameters.GetString(categoryParameter);
                }
            }
        }
        
        if (value.length > 0) expr = TALibrary.currentQuestion.categories.questionName + '="' + value + '"';
        if(expr.length>0) filter.Expression=expr;
    }
}