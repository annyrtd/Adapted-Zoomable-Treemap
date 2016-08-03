class ZoomableTreemap {
  
  	//Globals
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var confirmit: ConfirmitFacade;
    static var user: User;
  
  	static function ZoomableTreemapPage_render(context: Object) {  
      TALibrary.setReport(context.pageContext, context.log, context.report, context.confirmit, context.user);
      TALibrary.setCurrentQuestion(context.pageContext.Items["questionID"]);
 	}
  
  	static function setGlobals(p: ScriptPageContext, l: Logger, r: Report, c: ConfirmitFacade, u: User){
        pageContext = p;
        log = l;
        report = r;
        confirmit = c;
        user = u;
    }
  
    static function txtHierarchPrint_render(context) {
       
        //log.LogDebug('hierarchy: ' + TALibrary.currentQuestion.hierarchy);
      
        var headers, flatHierarchy;
      	var tableName = TALibrary.currentQuestion.questionDetails.FlatHierarchyTableName;
        try {
          	sleep(1500);
          	var newHeaders = TATableData.getTableRowHeaders(tableName);
      		headers = newHeaders;
          
          	log.LogDebug('headers: ' + headers);
        } catch(e) {
          
          	var cachedHeaders = TALibrary.currentQuestion.flatTableHeaders;
          	headers = cachedHeaders;    
          	
            if (!headers)
            {
                return;
            }
        }
      
        var text = context.component;
        text.Output.Append(JSON.print(TALibrary.currentQuestion.hierarchy,"hierarchy"));
        text.Output.Append(JSON.print(headers,"rowheaders"));
      	   		
        TALibrary.currentQuestion.flatTableHeaders = newHeaders;
    }
  
  static function sleep(interval: Int32) {
		var ms = interval + new Date().getTime();
		while (new Date().getTime() < ms){}
	 }
  
    static function flatHierarchyTable_render(context) {
        var table = context.component;
        
        var project = report.DataSource.GetProject(TALibrary.currentQuestion.questionDetails.TADatasourceId);
        var qe1 : QuestionnaireElement = project.CreateQuestionnaireElement(TALibrary.currentQuestion.categorySentiment.questionName);
        var hq1 : HeaderQuestion = new HeaderQuestion(qe1);
      	hq1.IsCollapsed = true;
        hq1.ShowTotals = false;
        table.RowHeaders.Add(hq1);
      
        var hq2 : HeaderStatistics = new HeaderStatistics();
      	hq2.Statistics.Avg = true;
        table.ColumnHeaders.Add(hq2);
        
        var hq3 : HeaderBase = new HeaderBase();
        table.ColumnHeaders.Add(hq3);
        
        table.CssClass = "hidden";
        
        table.Drilling.Rows.Enabled = true;
        table.Drilling.Rows.Type = DrilldownType.SetParameter;
        table.Drilling.Rows.ParameterID = TALibrary.currentQuestion.questionDetails.DrilldownParameter;
        table.Drilling.Rows.TargetPages = TALibrary.currentQuestion.questionDetails.DetailedAnalysisPageId;    
    } 
  
  	static function txtTreemapHeader_Render(context) {
      	var label = "Zoomable Treemap";
        context.component.Output.Append(label);
  	}
}