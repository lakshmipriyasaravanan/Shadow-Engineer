import os
import structlog
import json
from typing import AsyncGenerator, List, Dict
from openai import AsyncOpenAI
from ai_service.prompts import PromptTemplates

logger = structlog.get_logger()

class LLMGateway:
    """Abstraction layer for generating completions via LLMs."""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY is not set. Inference will fail.")
        
        self.client = AsyncOpenAI(api_key=api_key)
        self.default_model = "gpt-4o"

    async def generate_response_stream(
        self, 
        query: str, 
        context_chunks: list[dict],
        history: List[Dict[str, str]] = None
    ) -> AsyncGenerator[str, None]:
        """Generates a streaming SSE response using retrieved context and chat history."""
        
        messages = [{"role": "system", "content": PromptTemplates.SYSTEM_ROLE}]
        
        # Inject Conversation Memory
        if history:
            # Take last 10 messages to avoid token overflow
            for msg in history[-10:]:
                messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Inject RAG Context into the final user prompt
        user_prompt = PromptTemplates.build_repository_chat_prompt(query, context_chunks)
        messages.append({"role": "user", "content": user_prompt})
        
        try:
            stream = await self.client.chat.completions.create(
                model=self.default_model,
                messages=messages,
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    # SSE format: data: {json}\n\n
                    data = json.dumps({"content": chunk.choices[0].delta.content})
                    yield f"data: {data}\n\n"
                    
            yield "data: [DONE]\n\n"
                    
        except Exception as e:
            logger.error("LLM Inference failed", error=str(e))
            error_data = json.dumps({"error": str(e)})
            yield f"data: {error_data}\n\n"
