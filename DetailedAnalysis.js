class DetailedAnalysis {
  	
  	//Globals
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var state: ReportState;
    static var confirmit: ConfirmitFacade;
    static var user: User;
  
  	static function DetailedAnalysisPage_render(context: Object) {      
      	TALibrary.setReport(context);
      	//TALibrary.setCurrentQuestion(pageContext.Items["questionID"]);
      	setHitlistFilters();
 	}
  
    static function setGlobals(context: Object) {            
      	log = context.log;
    	state = context.state;
      	pageContext = context.pageContext;
        report = context.report;
        confirmit = context.confirmit;
        user = context.user;   
    }
  
	static function setHitlistFilters() {         
      	var drilldownParameter = TALibrary.currentQuestion.questionDetails.DrilldownParameter;
      	var categoryParameter = TALibrary.currentQuestion.questionDetails.TACategoryListParameter;    
      	var subCategoryParameter = TALibrary.currentQuestion.questionDetails.TASubcategoryListParameter;    
      	var attributesParameter = TALibrary.currentQuestion.questionDetails.TAAttributesListParameter;
      
      log.LogDebug('hitlist filters')
      
      	if (!state.Parameters.IsNull(drilldownParameter)) {
          	log.LogDebug('1')
          	state.Parameters[categoryParameter] = null;
            TALibrary.currentQuestion.setCurrentTheme(null);
          
      	    state.Parameters[subCategoryParameter] = null;
            TALibrary.currentQuestion.setCurrentSubcategory(null);
          
      	    state.Parameters[attributesParameter] = null;
            TALibrary.currentQuestion.setCurrentAttribute(null);
          
          	var value, indexAttribute, 
                parentSubcategory, indexSubcategory, 
                parentCategory, indexCategory;
          	
          	value = state.Parameters.GetString(drilldownParameter);
          	indexAttribute = getIndexOf(TALibrary.currentQuestion.attributes, 
                                            value, 
                                            function (first, second) { return first.id == second; }); 
          
          
          	log.LogDebug('2')
              
        	if (indexAttribute >= 0) {
              
          	log.LogDebug('3')
                TALibrary.currentQuestion.setCurrentAttribute(value);
              	state.Parameters[attributesParameter] = new ParameterValueResponse(value);
             	parentSubcategory = TALibrary.currentQuestion.attributes[indexAttribute].parent;
              	indexSubcategory = getIndexOf(TALibrary.currentQuestion.subcategories, 
                                                  parentSubcategory, 
                                                  function (first, second) { return first.id == second; });
              	if (indexSubcategory >= 0) {
          	log.LogDebug('4')
                    TALibrary.currentQuestion.setCurrentSubcategory(parentSubcategory);
                    state.Parameters[subCategoryParameter] = new ParameterValueResponse(parentSubcategory);
                    parentCategory = TALibrary.currentQuestion.subcategories[indexSubcategory].parent;
                    indexCategory = getIndexOf(TALibrary.currentQuestion.themes, 
                                                   parentCategory, 
                                                   function (first, second) { return first.id == second; });
                  	if (indexCategory >= 0) {
          	log.LogDebug('5')
                    	TALibrary.currentQuestion.setCurrentTheme(parentCategory);
                    	state.Parameters[categoryParameter] = new ParameterValueResponse(parentCategory);
                  	}
            	}
            } else {
          	log.LogDebug('6')
              	indexSubcategory = getIndexOf(TALibrary.currentQuestion.subcategories, 
                                                  value, 
                                                  function (first, second) { return first.id == second; });
              	if (indexSubcategory >= 0) {
          	log.LogDebug('7')
                    TALibrary.currentQuestion.setCurrentSubcategory(value);
                    state.Parameters[subCategoryParameter] = new ParameterValueResponse(value);
                    parentCategory = TALibrary.currentQuestion.subcategories[indexSubcategory].parent;    
                  
                    indexCategory = getIndexOf(TALibrary.currentQuestion.themes, 
                                                   parentCategory, 
                                                   function (first, second) { return first.id == second; });
                  if (indexCategory >= 0) {
          	log.LogDebug('9')
                    	TALibrary.currentQuestion.setCurrentTheme(parentCategory);
                    	state.Parameters[categoryParameter] = new ParameterValueResponse(parentCategory);
                  	}
            	} else {
          	log.LogDebug('10')
                	indexCategory = getIndexOf(TALibrary.currentQuestion.themes, 
                                                   value, 
                                                   function (first, second) { return first.id == second; });
                  	if (indexCategory >= 0) {
          	log.LogDebug('11')
                    	TALibrary.currentQuestion.setCurrentTheme(value);
                    	state.Parameters[categoryParameter] = new ParameterValueResponse(value);
                  	}
                }
            }
          
          	state.Parameters[drilldownParameter] = null;
        }      
      	else
     	{        
        		if(state.Parameters.IsNull(subCategoryParameter) || TALibrary.currentQuestion.currentSubcategory < 0 || state.Parameters.GetString(subCategoryParameter) != TALibrary.currentQuestion.subcategories[TALibrary.currentQuestion.currentSubcategory].id) {
                    state.Parameters[attributesParameter]=null;
                    TALibrary.currentQuestion.setCurrentAttribute(null);
                }else{
                    TALibrary.currentQuestion.setCurrentAttribute(state.Parameters.GetString(attributesParameter));
                }

                if(state.Parameters.IsNull(categoryParameter) || TALibrary.currentQuestion.currentTheme < 0 || state.Parameters.GetString(categoryParameter) != TALibrary.currentQuestion.themes[TALibrary.currentQuestion.currentTheme].id) {
                  state.Parameters[attributesParameter]=null;
                    TALibrary.currentQuestion.setCurrentAttribute(null);
                    state.Parameters[subCategoryParameter]=null;
                    TALibrary.currentQuestion.setCurrentSubcategory(null);
                }else{
                    TALibrary.currentQuestion.setCurrentSubcategory(state.Parameters.GetString(subCategoryParameter));
                }

                TALibrary.currentQuestion.setCurrentTheme(state.Parameters.GetString(categoryParameter));
                
        }
      
      	function getIndexOf(arr, val, compare) {
            if (!arr || val == null) return -1;
          
          	var compare = compare ? compare : function(first, second) { return first == second; };
     
            for (var i = 0; i < arr.length; i++) {
                if (compare(arr[i], val)) {
                    return i;
                }
            }
          
            return -1;
        }
  	}
  
  	static function htlTreemapDrilldown_render(context) {
        var hitlist = context.component;
        
        var p : Project = report.DataSource.GetProject(TALibrary.currentQuestion.questionDetails.TADatasourceId); 
        var codes = TALibrary.currentQuestion.questionDetails.TAHitlistFields;    
        
        var qe : QuestionnaireElement;
        var hitlistColumn : HitListColumn;
        
        for(var i=0 ;i<codes.length;i++)
        {
            qe = p.CreateQuestionnaireElement(codes[i]);
            hitlistColumn = new HitListColumn();
            hitlistColumn.QuestionnaireElement = qe;
            hitlist.Columns.Add(hitlistColumn);
        }
    }  
  
  	static function txtCategoryList_Hide(context){
        return false;
    }

    static function txtCategoryList_Render(context){
    var label = "Categories: ";
        context.component.Output.Append(label);
    }

    static function btnResetCategories_Hide(context){
        return false;
    }

    static function btnResetCategories_Render(context){
        context.component.Label = new Label(9,"x");
    }

    static function txtSubcategoryList_Hide(context){
        return (TALibrary.currentQuestion.currentTheme<0 || TALibrary.currentQuestion.themes[TALibrary.currentQuestion.currentTheme].children.length == 0);
    }

    static function txtSubcategoryList_Render(context){
        var label = "Subcategories: ";
        context.component.Output.Append(label);
    }

    static function lstSubcategoryList_Hide(context){
        return (TALibrary.currentQuestion.currentTheme<0 || TALibrary.currentQuestion.themes[TALibrary.currentQuestion.currentTheme].children.length == 0);
    }

    static function btnResetSubcategories_Hide(context){
        return (TALibrary.currentQuestion.currentTheme<0 || TALibrary.currentQuestion.themes[TALibrary.currentQuestion.currentTheme].children.length == 0);
    }

    static function btnResetSubcategories_Render(context){
        context.component.Label = new Label(9,"x");
    }

    static function txtAttributesList_Hide(context){
        return (TALibrary.currentQuestion.currentSubcategory<0 || TALibrary.currentQuestion.subcategories[TALibrary.currentQuestion.currentSubcategory].children.length == 0);
    }

    static function txtAttributesList_Render(context){
        var label = "Attributes: ";
        context.component.Output.Append(label);
    }

    static function lstAttributesList_Hide(context){
        return (TALibrary.currentQuestion.currentSubcategory<0 || TALibrary.currentQuestion.subcategories[TALibrary.currentQuestion.currentSubcategory].children.length == 0);
    }

    static function btnResetAttributes_Hide(context){
        return (TALibrary.currentQuestion.currentSubcategory<0 || TALibrary.currentQuestion.subcategories[TALibrary.currentQuestion.currentSubcategory].children.length == 0);
    }

    static function btnResetAttributes_Render(context){
        context.component.Label = new Label(9,"x");
    }

}