import os
from collections import defaultdict
from pygments.lexers import guess_lexer_for_filename
from pygments.util import ClassNotFound
import radon.complexity as radon_cc

def analyze_repository(repo_path: str):
    metrics = {
        "total_loc": 0,
        "total_files": 0,
        "total_directories": 0,
        "total_functions": 0,
        "total_classes": 0,
        "average_cyclomatic_complexity": 0.0,
        "language_distribution": defaultdict(int)
    }

    total_complexity = 0
    python_files_analyzed = 0

    for root, dirs, files in os.walk(repo_path):
        # Ignore common non-source directories
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'venv', '.venv', 'target', 'build', 'dist']]
        metrics["total_directories"] += len(dirs)

        for file in files:
            file_path = os.path.join(root, file)
            # Skip hidden files and compiled assets
            if file.startswith('.') or file.endswith(('.pyc', '.class', '.jar', '.exe', '.dll', '.so', '.pdf', '.png', '.jpg')):
                continue

            metrics["total_files"] += 1
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    loc = len(content.splitlines())
                    metrics["total_loc"] += loc

                    # Determine language
                    try:
                        lexer = guess_lexer_for_filename(file, content)
                        lang = lexer.name
                        metrics["language_distribution"][lang] += loc
                    except ClassNotFound:
                        pass # Ignore if language is unknown

                    # If Python, calculate cyclomatic complexity
                    if file.endswith('.py'):
                        try:
                            blocks = radon_cc.cc_visit(content)
                            file_complexity = sum([b.complexity for b in blocks])
                            total_complexity += file_complexity
                            python_files_analyzed += 1
                            
                            metrics["total_functions"] += sum(1 for b in blocks if type(b).__name__ == 'Function')
                            metrics["total_classes"] += sum(1 for b in blocks if type(b).__name__ == 'Class')
                        except Exception:
                            pass # Syntax errors in file, ignore

            except UnicodeDecodeError:
                pass # Binary file or wrong encoding, skip

    if python_files_analyzed > 0:
        metrics["average_cyclomatic_complexity"] = total_complexity / python_files_analyzed

    # Convert defaultdict to standard dict for JSON serialization
    metrics["language_distribution"] = dict(metrics["language_distribution"])
    return metrics
