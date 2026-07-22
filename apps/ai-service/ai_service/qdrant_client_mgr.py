import os
import structlog
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams

logger = structlog.get_logger()

class QdrantManager:
    """Manages the Qdrant Vector Database connection and collections."""
    
    COLLECTION_NAME = "repository_knowledge"
    VECTOR_SIZE = 1536 # OpenAI text-embedding-3-small dimension size

    def __init__(self):
        qdrant_host = os.getenv("QDRANT_HOST", "localhost")
        qdrant_port = int(os.getenv("QDRANT_PORT", "6333"))
        
        self.client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.initialize_collection()

    def initialize_collection(self):
        """Creates the collection if it doesn't exist."""
        try:
            collections = self.client.get_collections().collections
            collection_names = [c.name for c in collections]
            
            if self.COLLECTION_NAME not in collection_names:
                logger.info(f"Creating Qdrant collection: {self.COLLECTION_NAME}")
                self.client.create_collection(
                    collection_name=self.COLLECTION_NAME,
                    vectors_config=VectorParams(size=self.VECTOR_SIZE, distance=Distance.COSINE),
                )
                
                # Create Payload Indexes for fast metadata filtering
                self.client.create_payload_index(
                    collection_name=self.COLLECTION_NAME,
                    field_name="repository_id",
                    field_schema="keyword"
                )
                self.client.create_payload_index(
                    collection_name=self.COLLECTION_NAME,
                    field_name="file_path",
                    field_schema="keyword"
                )
            else:
                logger.info(f"Qdrant collection {self.COLLECTION_NAME} already exists.")
        except Exception as e:
            logger.error("Failed to initialize Qdrant", error=str(e))
            raise

    def get_client(self) -> QdrantClient:
        return self.client
