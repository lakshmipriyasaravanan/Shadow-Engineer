import structlog
from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from ai_service.qdrant_client_mgr import QdrantManager
from ai_service.embeddings import EmbeddingService
from typing import List, Dict, Any

logger = structlog.get_logger()

class RetrieverService:
    """Handles semantic retrieval from Qdrant Vector DB."""
    
    def __init__(self):
        self.qdrant_manager = QdrantManager()
        self.client: QdrantClient = self.qdrant_manager.get_client()
        self.embedding_service = EmbeddingService()

    def search(self, query: str, repository_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Performs a semantic search restricted to a specific repository."""
        logger.info(f"Performing semantic search for repo: {repository_id}")
        
        # 1. Embed the query
        query_vector = self.embedding_service.generate_embedding(query)
        
        # 2. Filter strictly by repository ID (Security Isolation)
        repo_filter = Filter(
            must=[
                FieldCondition(
                    key="repository_id",
                    match=MatchValue(value=repository_id)
                )
            ]
        )
        
        # 3. Search Qdrant
        search_result = self.client.search(
            collection_name=QdrantManager.COLLECTION_NAME,
            query_vector=query_vector,
            query_filter=repo_filter,
            limit=limit
        )
        
        # 4. Format results
        results = []
        for scored_point in search_result:
            results.append({
                "score": scored_point.score,
                "text": scored_point.payload.get("text", ""),
                "file_path": scored_point.payload.get("file_path", ""),
                "language": scored_point.payload.get("language", "")
            })
            
        return results
