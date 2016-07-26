class TAQuestion{
  
  	//Globals
    var log: Logger;
    var report: Report;
    var state: ReportState;
    var confirmit: ConfirmitFacade;
    var user: User;
    var project: Project;
    var schema: DBDesignerSchema;
    var table: DBDesignerTable;  
  
    var categories;
  	var categorySentiment;
  
  	var questionDetails: Object;
  
  	//TACategories
    var themes = [];
    var subcategories = [];
    var attributes = [];

    var hierarchy = []; //hierarchical structure of categories {id: String, name: String, children: []}
    var categoriesArray = [];//flat structure of categories {id: String, name: String, parentId: String} 
  
    var currentTheme = -1;
    var currentSubcategory = -1;
    var currentAttribute = -1;
  
  function TAQuestion(context: Object, questionObj: Object){
        var codes: StringCollection;
        var names: StringCollection;
        var parents: StringCollection;

        //Globals
        log = context.log;
        report = context.report;
        confirmit = context.confirmit;
        user = context.user;
        state = context.state;
    
    	questionDetails = questionObj ? questionObj : TAConfig.TAQuestions[0];
    
    	categories = { questionName: questionDetails.TAQuestionId + 'Categories'};
    	categorySentiment = { questionName: questionDetails.TAQuestionId + 'CategorySentiment'};
        
        var schema : DBDesignerSchema = confirmit.GetDBDesignerSchema(questionDetails.DatabaseSchemaId);
        var schemaTable : DBDesignerTable = schema.GetDBDesignerTable(questionDetails.DatabaseTableName);
        var codes = schemaTable.GetColumnValues("id")
        var names = schemaTable.GetColumnValues("__l9");
    	var parents = schemaTable.GetColumnValues(questionDetails.TARelationshipColumnName);    
        
        for(var i=0; i<codes.Count; i++){
           categoriesArray.push({id: codes.Item(i), name: names.Item(i), parent: parents.Item(i)});
        }
        setupHierarchy(codes, names, parents, 0, null);

    }
  
  function setupHierarchy(codes: StringCollection, names: StringCollection, parents: StringCollection, level: Byte, parentObj){
        var newObj: Object;
        var parentObjId = parentObj?parentObj.id:"";


        for(var i=0; i<codes.Count; i++){
            if((!parentObj && !parents.Item(i)) || parentObjId.CompareTo(parents.Item(i)) == 0){
                newObj = new Object();
                newObj = {id: codes.Item(i), name: names.Item(i), parent: (parentObj?parentObj.id:""), children: []};

                setupHierarchy(codes, names, parents, (level+1), newObj);

                if(!parentObj)
                    hierarchy.push(newObj);
                else
                    parentObj.children.push(newObj);

                switch(level){
                    case 0:
                        themes.push(newObj);    
                    //log.LogDebug('themes');
                        break;
                    case 1:
                        subcategories.push(newObj);   
                   // log.LogDebug('subcategories');
                        break;
                    case 2:
                        attributes.push(newObj);   
                    //log.LogDebug('attributes');
                        break;
                    default:
                        break;
                }
            }
        }
    }
  
  /**
     * function to set current top Category from parameter
     * @param {Object} context - context object from page {component: page, pageContext: pageContext, log: log, report: report, state: state, confirmit: confirmit, user: user}
     */
    function setCurrentTheme(paramValue){
        if(paramValue){
            var themeId = paramValue;
            for(var i=0; i<themes.length;i++){
                if(themes[i].id == themeId){
                    currentTheme = i;
                    break;
                }
            }
        }else{
            currentTheme = -1;
        }
    }
  
  /**
     * function to set current Subcategory from parameter
     * @param {Object} context - context object from page {component: page, pageContext: pageContext, log: log, report: report, state: state, confirmit: confirmit, user: user}
     */
    function setCurrentSubcategory(paramValue){
        if(paramValue){
            var subcatId = paramValue;
            for(var i=0; i<subcategories.length;i++){
                if(subcategories[i].id == subcatId){
                    currentSubcategory = i;
                    break;
                }
            }
        }else{
            currentSubcategory = -1;
        }
    }

    /**
     * function to set current attribute from parameter
     * @param {Object} context - context object from page {component: page, pageContext: pageContext, log: log, report: report, state: state, confirmit: confirmit, user: user}
     */
    function setCurrentAttribute(paramValue){
        if(paramValue){
            var attrId = paramValue;
            for(var i=0; i<attributes.length;i++){
                if(attributes[i].id ==  attrId){
                    currentAttribute = i;
                    break;
                }
            }
        }else{
            currentAttribute = -1;
        }
    }
  
}