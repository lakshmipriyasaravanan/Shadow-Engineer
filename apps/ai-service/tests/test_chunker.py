import pytest
from ai_service.chunker import RepositoryChunker

def test_chunk_file_python():
    chunker = RepositoryChunker(chunk_size=100, chunk_overlap=10)
    
    python_code = """
def hello_world():
    print("Hello World!")
    
def add(a, b):
    return a + b
"""
    
    chunks = chunker.chunk_file("test.py", python_code, "repo-123", "main")
    
    assert len(chunks) > 0
    assert chunks[0]["metadata"]["language"] == "py"
    assert chunks[0]["metadata"]["repository_id"] == "repo-123"
