import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_root_or_docs(client: AsyncClient):
    response = await client.get("/docs")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_auth_and_evaluations_flow(client: AsyncClient):
    # 1. Register a new user
    register_payload = {
        "email": "testuser@example.com",
        "password": "strongpassword123",
        "full_name": "Test User"
    }
    reg_res = await client.post("/api/v1/auth/register", json=register_payload)
    assert reg_res.status_code == 201, reg_res.text
    user_data = reg_res.json()
    assert "id" in user_data

    # 2. Login
    login_res = await client.post(
        "/api/v1/auth/login",
        data={"username": "testuser@example.com", "password": "strongpassword123"}
    )
    assert login_res.status_code == 200, login_res.text
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # 3. Create an evaluation
    eval_payload = {
        "target_country": "United States",
        "target_program": "Computer Science",
        "cgpa": 8.5,
        "gre_score": 320,
        "toefl_score": 105,
        "research_papers": 1,
        "work_experience_months": 12
    }
    eval_res = await client.post("/api/v1/evaluations/", json=eval_payload, headers=auth_headers)
    assert eval_res.status_code == 200, eval_res.text
    eval_data = eval_res.json()
    assert "recommendations" in eval_data
    assert len(eval_data["recommendations"]) > 0

    # 4. Fetch evaluation history
    hist_res = await client.get("/api/v1/evaluations/history", headers=auth_headers)
    assert hist_res.status_code == 200, hist_res.text
    history = hist_res.json()
    assert len(history) == 1
    assert history[0]["id"] == eval_data["id"]