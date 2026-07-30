from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split,cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
X,y=load_iris(return_X_y=True)
X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=42)
dt=DecisionTreeClassifier(max_depth=3).fit(X_train,y_train)
rf=RandomForestClassifier(random_state=42).fit(X_train,y_train)
print(dt.score(X_test,y_test),rf.score(X_test,y_test),cross_val_score(rf,X,y,cv=5).mean())
print(rf.feature_importances_)