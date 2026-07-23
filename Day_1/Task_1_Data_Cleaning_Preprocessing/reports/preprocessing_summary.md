# Day 1 Task 1: Preprocessing Summary

## Raw Dataset Profile
- Rows: 40
- Columns: 12

### Data Types

| Column | Type |
| --- | --- |
| PassengerId | int64 |
| Survived | int64 |
| Pclass | int64 |
| Name | object |
| Sex | object |
| Age | float64 |
| SibSp | int64 |
| Parch | int64 |
| Ticket | object |
| Fare | float64 |
| Cabin | object |
| Embarked | object |

### Missing Values

| Column | Missing Count |
| --- | ---: |
| PassengerId | 0 |
| Survived | 0 |
| Pclass | 0 |
| Name | 0 |
| Sex | 0 |
| Age | 9 |
| SibSp | 0 |
| Parch | 0 |
| Ticket | 0 |
| Fare | 0 |
| Cabin | 31 |
| Embarked | 0 |

## Cleaning Steps Completed
- Filled missing `Age` and `Fare` values with the median.
- Filled missing `Embarked` values with the most frequent category.
- Replaced missing `Cabin` values with `Unknown` and converted cabin availability to `CabinKnown`.
- Removed identifier/high-cardinality text columns: `PassengerId`, `Name`, `Ticket`, and `Cabin`.
- Encoded categorical columns using one-hot encoding.
- Capped numeric outliers with the IQR method.
- Standardized numeric columns with `StandardScaler`.

## Processed Dataset Profile
- Rows before cleaning: 40
- Rows after cleaning: 40
- Columns after cleaning: 10
- Remaining missing values: 0

## Generated Files
- `data/processed/titanic_cleaned.csv`
- `outputs/figures/raw_boxplots.png`
- `outputs/figures/cleaned_boxplots.png`
