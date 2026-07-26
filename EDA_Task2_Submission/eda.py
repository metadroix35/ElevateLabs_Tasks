
import pandas as pd
import matplotlib.pyplot as plt

df=pd.read_csv("iris.csv")
print(df.describe(include="all"))
print(df.corr(numeric_only=True))
