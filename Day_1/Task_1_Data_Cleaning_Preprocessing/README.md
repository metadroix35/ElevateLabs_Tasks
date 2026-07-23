# Day 1 Task 1: Data Cleaning and Preprocessing

This project completes the AI & ML Internship Day 1 Task 1 assignment. It demonstrates how to clean and prepare a raw Titanic-style dataset for machine learning.

## Objective

Clean and preprocess raw data by handling missing values, encoding categorical variables, scaling numerical features, and visualizing/treating outliers.

## Folder Structure

```text
Day_1/
└── Task_1_Data_Cleaning_Preprocessing/
    ├── data/
    │   ├── raw/
    │   │   └── titanic_sample.csv
    │   └── processed/
    │       └── titanic_cleaned.csv
    ├── outputs/
    │   └── figures/
    │       ├── raw_boxplots.png
    │       └── cleaned_boxplots.png
    ├── reports/
    │   ├── interview_questions.md
    │   └── preprocessing_summary.md
    ├── src/
    │   └── preprocess_titanic.py
    ├── README.md
    └── requirements.txt
```

## Tools Used

- Python
- Pandas
- NumPy
- Matplotlib
- scikit-learn

## Steps Completed

1. Imported the dataset and explored shape, data types, and missing values.
2. Filled missing numerical values using the median.
3. Filled missing categorical values using the mode or a meaningful placeholder.
4. Converted categorical features into numerical features using one-hot encoding.
5. Visualized outliers with boxplots.
6. Treated numeric outliers using the IQR capping method.
7. Standardized numerical features using `StandardScaler`.
8. Saved the cleaned dataset and preprocessing summary.

## How to Run

From this folder, run:

```bash
python src/preprocess_titanic.py
```

The processed dataset and plots will be generated in `data/processed` and `outputs/figures`.

## Output

- Cleaned dataset: `data/processed/titanic_cleaned.csv`
- Preprocessing report: `reports/preprocessing_summary.md`
- Interview answers: `reports/interview_questions.md`
- Boxplot visualizations: `outputs/figures`
