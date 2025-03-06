import pytest
from app import app as flask_app
from config import TestConfig

@pytest.fixture
def app():
    flask_app.config.from_object(TestConfig)
    return flask_app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()
