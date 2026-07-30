from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error,mean_squared_error,r2_score
X,y=load_diabetes(return_X_y=True)
X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=42)
m=LinearRegression().fit(X_train,y_train)
p=m.predict(X_test)
print("MAE",mean_absolute_error(y_test,p))
print("MSE",mean_squared_error(y_test,p))
print("R2",r2_score(y_test,p))
print("Coefficients",m.coef_)