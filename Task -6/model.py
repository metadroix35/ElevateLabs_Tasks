from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt

def find_best_k(X_train, y_train, X_test, y_test, max_k=10):
    k_values = range(1, max_k + 1)
    accuracies = []

    for k in k_values:
        knn = KNeighborsClassifier(n_neighbors=k)
        knn.fit(X_train, y_train)
        y_pred = knn.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        accuracies.append(accuracy)
        print(f"K = {k}, Accuracy = {accuracy:.4f}")

    best_k = k_values[accuracies.index(max(accuracies))]
    print(f"\nBest K: {best_k}")
    print(f"Best Accuracy: {max(accuracies):.4f}")
    
    return best_k, k_values, accuracies

def train_evaluate_model(X_train, y_train, X_test, y_test, k):
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
def plot_k_accuracies(k_values, accuracies, save_path="knn_accuracy.png"):
    plt.figure(figsize=(8, 5))
    plt.plot(k_values, accuracies, marker='o', linestyle='dashed', color='b')
    plt.xlabel("K Value")
    plt.ylabel("Accuracy")
    plt.title("KNN Accuracy for Different K Values")
    plt.xticks(k_values)
    plt.grid(True)
    plt.savefig(save_path)
    print(f"\nPlot saved to {save_path}")
    # plt.show() # Uncomment if running interactively
