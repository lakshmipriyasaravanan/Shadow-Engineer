class PromptTemplates:
    """Centralized prompt builder for Shadow Engineer AI capabilities."""
    
    SYSTEM_ROLE = """You are Shadow Engineer, an elite Staff Principal Software Architect and AI pair programmer.
Your goal is to answer questions about the user's repository with extreme precision. 
Always prioritize the provided context over your general knowledge. If the context doesn't contain the answer, say so, but offer logical extrapolations if possible.
When referencing code, cite the exact file path."""

    @staticmethod
    def build_repository_chat_prompt(query: str, context_chunks: list[dict]) -> str:
        """Builds a prompt injecting the retrieved context chunks."""
        
        context_str = "\n\n".join(
            f"--- FILE: {chunk['file_path']} ---\n{chunk['text']}" 
            for chunk in context_chunks
        )
        
        return f"""Use the following repository context to answer the question.

<CONTEXT>
{context_str}
</CONTEXT>

Question: {query}"""

    @staticmethod
    def build_code_review_prompt(diff: str) -> str:
        return f"""Review the following code changes. 
Focus on:
1. Security vulnerabilities
2. Performance bottlenecks
3. Clean Code violations

<DIFF>
{diff}
</DIFF>"""

    @staticmethod
    def build_documentation_prompt(code: str) -> str:
        return f"""Generate comprehensive Javadoc/Docstring style inline documentation for the following code:
<CODE>
{code}
</CODE>"""
