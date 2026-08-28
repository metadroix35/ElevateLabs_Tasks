"""Day 1 Task 1: clean and preprocess a Titanic-style dataset."""

from pathlib import Path

import matplotlib
import pandas as pd
from sklearn.preprocessing import StandardScaler


matplotlib.use("Agg")

import matplotlib.pyplot as plt


PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_DATA = PROJECT_ROOT / "data" / "raw" / "titanic_sample.csv"
PROCESSED_DATA = PROJECT_ROOT / "data" / "processed" / "titanic_cleaned.csv"
FIGURES_DIR = PROJECT_ROOT / "outputs" / "figures"
REPORT_PATH = PROJECT_ROOT / "reports" / "preprocessing_summary.md"


def load_data() -> pd.DataFrame:
    """Load the raw CSV dataset."""
    return pd.read_csv(RAW_DATA)


def save_basic_profile(df: pd.DataFrame) -> None:
    """Write a concise profile before preprocessing."""
    missing = df.isna().sum()
    dtypes = df.dtypes.astype(str)

    lines = [
        "# Day 1 Task 1: Preprocessing Summary",
        "",
        "## Raw Dataset Profile",
        f"- Rows: {df.shape[0]}",
        f"- Columns: {df.shape[1]}",
        "",
        "### Data Types",
        "",
        "| Column | Type |",
        "| --- | --- |",
    ]
    lines.extend(f"| {column} | {dtype} |" for column, dtype in dtypes.items())
    lines.extend(["", "### Missing Values", "", "| Column | Missing Count |", "| --- | ---: |"])
    lines.extend(f"| {column} | {count} |" for column, count in missing.items())

    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def plot_boxplots(df: pd.DataFrame, name: str) -> None:
    """Save boxplots for numeric columns to inspect outliers."""
    numeric_columns = ["Age", "SibSp", "Parch", "Fare"]
    fig, axes = plt.subplots(1, len(numeric_columns), figsize=(14, 4))

    for axis, column in zip(axes, numeric_columns):
        axis.boxplot(df[column].dropna(), vert=True)
        axis.set_title(column)
        axis.set_xticks([])

    fig.tight_layout()
    fig.savefig(FIGURES_DIR / f"{name}_boxplots.png", dpi=150)
    plt.close(fig)


def cap_outliers_iqr(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """Cap numeric outliers using the IQR method."""
    cleaned = df.copy()

    for column in columns:
        q1 = cleaned[column].quantile(0.25)
        q3 = cleaned[column].quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        cleaned[column] = cleaned[column].clip(lower=lower_bound, upper=upper_bound)

    return cleaned


def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    """Clean missing values, encode categories, cap outliers, and standardize numbers."""
    cleaned = df.copy()

    cleaned["Age"] = cleaned["Age"].fillna(cleaned["Age"].median())
    cleaned["Fare"] = cleaned["Fare"].fillna(cleaned["Fare"].median())
    cleaned["Embarked"] = cleaned["Embarked"].fillna(cleaned["Embarked"].mode()[0])
    cleaned["Cabin"] = cleaned["Cabin"].fillna("Unknown")

    cleaned["CabinKnown"] = (cleaned["Cabin"] != "Unknown").astype(int)
    cleaned = cleaned.drop(columns=["PassengerId", "Name", "Ticket", "Cabin"])

    cleaned = cap_outliers_iqr(cleaned, ["Age", "SibSp", "Parch", "Fare"])
    cleaned = pd.get_dummies(cleaned, columns=["Sex", "Embarked"], drop_first=True, dtype=int)

    numeric_columns = ["Pclass", "Age", "SibSp", "Parch", "Fare"]
    scaler = StandardScaler()
    cleaned[numeric_columns] = scaler.fit_transform(cleaned[numeric_columns])

    return cleaned


def append_final_summary(raw_df: pd.DataFrame, cleaned_df: pd.DataFrame) -> None:
    """Append the actions and output profile to the markdown report."""
    lines = [
        "",
        "## Cleaning Steps Completed",
        "- Filled missing `Age` and `Fare` values with the median.",
        "- Filled missing `Embarked` values with the most frequent category.",
        "- Replaced missing `Cabin` values with `Unknown` and converted cabin availability to `CabinKnown`.",
        "- Removed identifier/high-cardinality text columns: `PassengerId`, `Name`, `Ticket`, and `Cabin`.",
        "- Encoded categorical columns using one-hot encoding.",
        "- Capped numeric outliers with the IQR method.",
        "- Standardized numeric columns with `StandardScaler`.",
        "",
        "## Processed Dataset Profile",
        f"- Rows before cleaning: {raw_df.shape[0]}",
        f"- Rows after cleaning: {cleaned_df.shape[0]}",
        f"- Columns after cleaning: {cleaned_df.shape[1]}",
        f"- Remaining missing values: {int(cleaned_df.isna().sum().sum())}",
        "",
        "## Generated Files",
        "- `data/processed/titanic_cleaned.csv`",
        "- `outputs/figures/raw_boxplots.png`",
        "- `outputs/figures/cleaned_boxplots.png`",
    ]

    with REPORT_PATH.open("a", encoding="utf-8") as report:
        report.write("\n".join(lines) + "\n")


def main() -> None:
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    PROCESSED_DATA.parent.mkdir(parents=True, exist_ok=True)

    raw_df = load_data()
    save_basic_profile(raw_df)
    plot_boxplots(raw_df, "raw")

    cleaned_df = preprocess(raw_df)
    cleaned_df.to_csv(PROCESSED_DATA, index=False)
    plot_boxplots(cleaned_df, "cleaned")
    append_final_summary(raw_df, cleaned_df)

    print("Day 1 Task 1 preprocessing completed.")
    print(f"Processed dataset: {PROCESSED_DATA}")
    print(f"Summary report: {REPORT_PATH}")


if __name__ == "__main__":
    main()
