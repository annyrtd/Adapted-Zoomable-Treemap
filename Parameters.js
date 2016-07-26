class Parameters{
    static function pCategoryList_Domain(context){
        TAParameterUtils.createThemesListParameter(context.component, context.pageContext.Items["questionID"]);
    }

    static function pSubcategoryList_Mask(context){
        TAParameterUtils.getSubcategoriesMask(context.component);
    }

    static function pSubcategoryList_Domain(context){
        TAParameterUtils.createSubcategoriesListParameter(context.component, context.pageContext.Items["questionID"]);
    }

    static function pAttributesList_Mask(context){
        TAParameterUtils.getAttributesMask(context.component);
    }

    static function pAttributesList_Domain(context){
        TAParameterUtils.createAttributesListParameter(context.component, context.pageContext.Items["questionID"]);
    }
}