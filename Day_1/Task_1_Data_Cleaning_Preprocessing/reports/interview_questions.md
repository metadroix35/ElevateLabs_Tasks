# Day 1 Task 1: Interview Questions

## 1. What are the different types of missing data?

- MCAR: Missing Completely at Random, where missingness has no pattern.
- MAR: Missing at Random, where missingness depends on other available variables.
- MNAR: Missing Not at Random, where missingness depends on the missing value itself.

## 2. How do you handle categorical variables?

Categorical variables can be handled with label encoding, one-hot encoding, ordinal encoding, frequency encoding, or target encoding. The best method depends on whether the category has a natural order and how many unique categories it has.

## 3. What is the difference between normalization and standardization?

Normalization usually scales values to a fixed range such as 0 to 1. Standardization transforms values so they have a mean of 0 and a standard deviation of 1.

## 4. How do you detect outliers?

Common methods include boxplots, the IQR rule, z-scores, scatter plots, and domain-specific thresholds.

## 5. Why is preprocessing important in ML?

Preprocessing improves data quality, makes features usable by algorithms, reduces noise, and can significantly improve model accuracy and reliability.

## 6. What is one-hot encoding vs label encoding?

One-hot encoding creates separate binary columns for each category. Label encoding assigns each category an integer value. One-hot encoding is better for nominal categories, while label encoding is useful for ordinal categories.

## 7. How do you handle data imbalance?

Data imbalance can be handled with resampling, class weights, synthetic data generation such as SMOTE, better evaluation metrics, or collecting more minority-class data.

## 8. Can preprocessing affect model accuracy?

Yes. Handling missing values, scaling features, encoding categories, and treating outliers can directly affect the patterns a model learns and therefore its accuracy.
