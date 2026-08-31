import pytest

@pytest.mark.asyncio
async def test_root_or_docs(client):
    response = await client.get("/docs")
    assert response.status_code == 200