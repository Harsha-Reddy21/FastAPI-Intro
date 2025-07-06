import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_get_expenses():
    response = requests.get(f"{BASE_URL}/api/expenses")
    print("GET /api/expenses:", response.status_code)
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print("Error:", response.text)

def test_create_expense():
    data = {
        "amount": 50.25,
        "category": "food",
        "description": "Test expense"
    }
    response = requests.post(f"{BASE_URL}/api/expenses", json=data)
    print("POST /api/expenses:", response.status_code)
    if response.status_code == 201:
        print(json.dumps(response.json(), indent=2))
    else:
        print("Error:", response.text)

def test_get_total():
    response = requests.get(f"{BASE_URL}/api/expenses/total")
    print("GET /api/expenses/total:", response.status_code)
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print("Error:", response.text)

if __name__ == "__main__":
    print("Testing API endpoints...")
    test_get_expenses()
    test_create_expense()
    test_get_total() 