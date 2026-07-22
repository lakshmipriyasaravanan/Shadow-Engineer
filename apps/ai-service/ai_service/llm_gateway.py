import os
import structlog
from typing import AsyncGenerator
from openai import AsyncOpenAI
from ai_service.prompts import PromptTemplates

logger = structlog.get_logger()

class LLMGateway:
    """Abstraction layer for generating completions via LLMs."""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY is not set. Inference will fail.")
        
        # Use AsyncOpenAI for async streaming support
        self.client = AsyncOpenAI(api_key=api_key)
        self.default_model = "gpt-4o"

    async def generate_response_stream(self, query: str, context_chunks: list[dict]) -> AsyncGenerator[str, None]:
        """Generates a streaming response using retrieved context."""
        
        system_prompt = PromptTemplates.SYSTEM_ROLE
        user_prompt = PromptTemplates.build_repository_chat_prompt(query, context_chunks)
        
        try:
            stream = await self.client.chat.completions.create(
                model=self.default_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error("LLM Inference failed", error=str(e))
            yield f"Error: Unable to generate response ({str(e)})"
