FROM python:3.11-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend/requirements.txt .

# Since we don't have a physical requirements.txt yet, we'll write the pip install command directly.
# But best practice is generating one. For this Dockerfile, we'll install directly:
RUN pip install --no-cache-dir fastapi uvicorn pandas numpy scikit-learn xgboost joblib pydantic pydantic-settings

# Copy backend source
COPY backend/ ./backend/

# Expose port
EXPOSE 8000

# Start server
CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
