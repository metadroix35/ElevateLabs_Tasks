from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report,roc_auc_score
X,y=load_breast_cancer(return_X_y=True)
X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=42)
sc=StandardScaler()
X_train=sc.fit_transform(X_train);X_test=sc.transform(X_test)
m=LogisticRegression(max_iter=1000).fit(X_train,y_train)
pred=m.predict(X_test)
print(classification_report(y_test,pred))
print("ROC AUC",roc_auc_score(y_test,m.predict_proba(X_test)[:,1]))