import shap
import pandas as pd
import numpy as np

def get_shap_explanations(model, X_scaled, feature_names):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_scaled)
    
    if isinstance(shap_values, list):
        vals = shap_values[1][0]
    else:
        # Check shape to handle batch vs single correctly
        if len(shap_values.shape) > 1:
            vals = shap_values[0]
        else:
            vals = shap_values
            
    explanations = []
    for i, feature in enumerate(feature_names):
        contribution = float(vals[i])
        direction = "Increased Risk" if contribution > 0 else "Decreased Risk"
        if contribution != 0:
            explanations.append({
                "feature": feature,
                "contribution": abs(contribution),
                "direction": direction
            })
            
    explanations.sort(key=lambda x: x['contribution'], reverse=True)
    return explanations[:5]
