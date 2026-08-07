import pytest
from fastapi.testclient import TestClient

# Import FastAPI application from app.py or server.py
from src.app import app  # Adjust the import path based on your project structure

client = TestClient(app)

def test_validate_entry_success():
    """
    Test case to verify that a valid entry is accepted by the POST handler.
    """
    # Sample data for a valid entry
    payload = {
        "title": "Test Entry",
        "content": "This is a test entry.",
        "tags": ["test", "api"]
    }

    response = client.post("/api/entries/", json=payload)
    
    assert response.status_code == 201
    assert response.json()["message"] == "Entry created successfully"

def test_validate_entry_failure():
    """
    Test case to verify that an invalid entry is rejected by the POST handler.
    """
    # Sample data for an invalid entry (missing required field)
    payload = {
        "content": "This is a test entry.",
        "tags": ["test", "api"]
    }

    response = client.post("/api/entries/", json=payload)
    
    assert response.status_code == 400
    assert "title" in response.json()

def test_validate_entry_with_long_content():
    """
    Test case to verify that an entry with a very long content is rejected by the POST handler.
    """
    # Sample data for an entry with a very long content
    payload = {
        "title": "Test Entry",
        "content": "a" * 10000,  # Assuming max length is 5000 characters
        "tags": ["test", "api"]
    }

    response = client.post("/api/entries/", json=payload)
    
    assert response.status_code == 400
    assert "content" in response.json()