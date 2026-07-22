import os
import structlog
from typing import List
from openai import OpenAI

logger = structlog.get_logger()

class EmbeddingService:
    """Handles generating embeddings using OpenAI's API."""

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY is not set. Embeddings will fail.")
        
        self.client = OpenAI(api_key=api_key)
        self.model = "text-embedding-3-small"

    def generate_embedding(self, text: str) -> List[float]:
        """Generates a single vector embedding."""
        try:
            response = self.client.embeddings.create(
                input=[text],
                model=self.model
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error("Failed to generate embedding", error=str(e))
            raise

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generates embeddings for a batch of strings."""
        if not texts:
            return []
            
        try:
            response = self.client.embeddings.create(
                input=texts,
                model=self.model
            )
            return [data.embedding for data in response.data]
        except Exception as e:
            logger.error("Failed to generate batch embeddings", error=str(e))
            raise
