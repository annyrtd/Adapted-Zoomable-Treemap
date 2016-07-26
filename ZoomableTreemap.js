class ZoomableTreemap {
  
  	//Globals
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var state: ReportState;
    static var confirmit: ConfirmitFacade;
    static var user: User;
  
  	static function ZoomableTreemapPage_render(context: Object) {  
      TALibrary.setReport(context);
      //TALibrary.setCurrentQuestion(pageContext.Items["questionID"]);
 	}
  
  	static function setGlobals(context: Object) {            
      	log = context.log;
    	state = context.state;
      	pageContext = context.pageContext;
        report = context.report;
        confirmit = context.confirmit;
        user = context.user;   
    }  
  
    static function txtHierarchPrint_render(context) {
        var text = context.component;
        
        var headers, flatHierarchy;
        try {
            headers = TATableData.getTableRowHeaders(TALibrary.currentQuestion.questionDetails.FlatHierarchyTableName);
            flatHierarchy = headers;
        } catch(e) {
            headers = flatHierarchy ? flatHierarchy : null;
            if (!headers)
            {
                return;
            }
        }
        
        text.Output.Append(JSON.print(TALibrary.currentQuestion.hierarchy,"hierarchy"));
        text.Output.Append(JSON.print(headers,"rowheaders"));
    }
  
    static function flatHierarchyTable_render(context) {
        var table = context.component;
        
        var project = report.DataSource.GetProject(TALibrary.currentQuestion.questionDetails.TADatasourceId);
        var qe1 : QuestionnaireElement = project.CreateQuestionnaireElement(TALibrary.currentQuestion.categories.questionName);
        var hq1 : HeaderQuestion = new HeaderQuestion(qe1);
        hq1.ShowTotals = false;
        table.RowHeaders.Add(hq1);
      
        var qe2 : QuestionnaireElement  = project.CreateQuestionnaireElement(TALibrary.currentQuestion.categorySentiment.questionName);
        var hq2 : HeaderQuestion = new HeaderQuestion(qe2);
        hq2.ShowTotals = false;
        hq2.IsCollapsed = true;
        hq2.DefaultStatistic = StatisticsType.Average;
        hq2.Preaggregation = StatisticsType.Average;
        table.ColumnHeaders.Add(hq2);
        
        var hq3 : HeaderBase = new HeaderBase();
        table.ColumnHeaders.Add(hq3);
        
        table.CssClass = "hidden";
        
        table.Drilling.Rows.Enabled = true;
        table.Drilling.Rows.Type = DrilldownType.SetParameter;
        table.Drilling.Rows.ParameterID = TALibrary.currentQuestion.questionDetails.DrilldownParameter;
        table.Drilling.Rows.TargetPages = TALibrary.currentQuestion.questionDetails.DetailedAnalysisPageId;    
    }    
}