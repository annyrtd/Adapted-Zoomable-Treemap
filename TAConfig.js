class TAConfig {
  static var TAQuestions = [

        // ***** Change these variables to include the correct information

        //Question 0
        {
          	TADatasourceId: "ds0",  // the Reportal Data Source ID of the dataset
          	DatabaseSchemaId: 5100, //Schema containing TA model
            DatabaseTableName: 'Cat - Retail API Mod', //Table containing TA model
          	TARelationshipColumnName: "parent",
            TAQuestionName: "cb", // the question ID of the Text Analytics verbatim quesiton
          	TAModelNo : "",	// the Genius Model ID
            TAQuestionId: "cb", //unique id for question+model
            
			
          	OverallAnalysisPageId: "",
            DetailedAnalysisPageId: "detailed_analysis",
          	TACategoryListParameter: "pCategoryListTA",
          	TASubcategoryListParameter: "pSubcategoryListTA",
          	TAAttributesListParameter: "pAttributesListTA",
          	DrilldownParameter: "pZoomableTreemap",
          	FlatHierarchyTableName: 'flatHierarchy',
          	TAHitlistFields: ['interview_start', 'rtQ4a', 'comCMT', 'comCB4' , 'cbCategories']
        }
    ];
}