from data_loader import get_or_create_dataset, prepare_data
from model import find_best_k, train_evaluate_model, plot_k_accuracies

def main():
    print("1. Loading dataset...")
    X, y = get_or_create_dataset("iris.csv")
    
    print("\n2. Preparing data...")
    X_train, X_test, y_train, y_test = prepare_data(X, y)
    
    print("\n3. Finding the best K value...")
    best_k, k_values, accuracies = find_best_k(X_train, y_train, X_test, y_test)
    
    print(f"\n4. Training final model with K={best_k}...")
    train_evaluate_model(X_train, y_train, X_test, y_test, best_k)
    
    print("\n5. Plotting K vs Accuracy...")
    plot_k_accuracies(k_values, accuracies)

if __name__ == "__main__":
    main()
