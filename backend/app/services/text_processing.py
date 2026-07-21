import re
from typing import List, Dict, Any

def clean_transcript(text: str) -> str:
    """Removes timestamp annotations like [00:01:23] while maintaining sentence flow."""
    cleaned = re.sub(r'\[\d{2}:\d{2}:\d{2}\]', '', text)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    return cleaned.strip()

def chunk_text(text: str, chunk_size: int = 700, overlap: int = 150) -> List[str]:
    """
    Sentence-boundary aware chunking with sliding overlap.
    Preserves semantic context integrity by splitting on natural sentence boundaries.
    """
    cleaned_text = clean_transcript(text)
    if not cleaned_text:
        return []

    # Split into sentence and paragraph units
    raw_sentences = re.split(r'(?<=[.?!])\s+|\n\n+', cleaned_text)
    sentences = [s.strip() for s in raw_sentences if s.strip()]

    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sentence_len = len(sentence)
        if current_length + sentence_len <= chunk_size or not current_chunk:
            current_chunk.append(sentence)
            current_length += sentence_len
        else:
            chunk_str = " ".join(current_chunk)
            chunks.append(chunk_str)
            
            # Form overlap from trailing sentences
            overlap_chunk = []
            overlap_len = 0
            for s in reversed(current_chunk):
                if overlap_len + len(s) <= overlap:
                    overlap_chunk.insert(0, s)
                    overlap_len += len(s)
                else:
                    break
            
            current_chunk = overlap_chunk + [sentence]
            current_length = sum(len(s) for s in current_chunk)

    if current_chunk:
        chunk_str = " ".join(current_chunk)
        if not chunks or chunk_str != chunks[-1]:
            chunks.append(chunk_str)

    return chunks

def analyze_chunks(chunks: List[str]) -> Dict[str, Any]:
    if not chunks:
        return {"total_chunks": 0, "avg_chunk_size": 0, "total_chars": 0}
    total_chars = sum(len(c) for c in chunks)
    return {
        "total_chunks": len(chunks),
        "avg_chunk_size": round(total_chars / len(chunks)),
        "total_chars": total_chars,
        "strategy": "Sentence-Aware Sliding Window (700 chars, 150 overlap)"
    }
