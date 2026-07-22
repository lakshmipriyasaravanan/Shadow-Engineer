from typing import List, Dict, Any
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    Language,
)

class RepositoryChunker:
    """Intelligent Syntax-aware chunking for repository source code."""

    # Map file extensions to LangChain Language enums
    EXTENSION_MAP = {
        ".py": Language.PYTHON,
        ".js": Language.JS,
        ".jsx": Language.JS,
        ".ts": Language.TS,
        ".tsx": Language.TS,
        ".java": Language.JAVA,
        ".cpp": Language.CPP,
        ".cc": Language.CPP,
        ".go": Language.GO,
        ".rb": Language.RUBY,
        ".rs": Language.RUST,
        ".php": Language.PHP,
        ".html": Language.HTML,
        ".md": Language.MARKDOWN,
    }

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.default_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size, 
            chunk_overlap=self.chunk_overlap
        )

    def chunk_file(self, file_path: str, content: str, repo_id: str, branch: str) -> List[Dict[str, Any]]:
        """Chunks a file based on its language extension."""
        extension = self._get_extension(file_path)
        lang = self.EXTENSION_MAP.get(extension)

        if lang:
            splitter = RecursiveCharacterTextSplitter.from_language(
                language=lang, 
                chunk_size=self.chunk_size, 
                chunk_overlap=self.chunk_overlap
            )
        else:
            splitter = self.default_splitter

        chunks = splitter.create_documents([content])
        
        # Attach metadata to each chunk
        results = []
        for i, chunk in enumerate(chunks):
            results.append({
                "text": chunk.page_content,
                "metadata": {
                    "repository_id": repo_id,
                    "branch": branch,
                    "file_path": file_path,
                    "language": extension.strip('.'),
                    "chunk_index": i
                }
            })
            
        return results

    def _get_extension(self, file_path: str) -> str:
        import os
        _, ext = os.path.splitext(file_path)
        return ext.lower()
