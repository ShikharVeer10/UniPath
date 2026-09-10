"""
Web search and entity affiliation resolver service.
Used by UniPath Admissions Guide / Advisor to search for any professor, researcher,
organization, or university link/URL provided by the user.
"""

import re
import json
import logging
import urllib.request
import urllib.parse
from typing import Optional, Dict, Any

logger = logging.getLogger("uvicorn.error")

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 UniPathAdvisor/1.0"

class WebSearchService:
    @staticmethod
    def extract_url(text: str) -> Optional[str]:
        """Detect if input contains a web link or URL."""
        match = re.search(r'https?://[^\s<>\"{}|\\^`]+', text)
        return match.group(0) if match else None

    @staticmethod
    def inspect_url(url: str) -> Dict[str, Any]:
        """Fetches and summarizes webpage title and visible text from a URL."""
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=7) as response:
                raw_html = response.read().decode("utf-8", errors="ignore")
                
                # Title
                title_match = re.search(r'<title[^>]*>(.*?)</title>', raw_html, re.IGNORECASE | re.DOTALL)
                title = title_match.group(1).strip() if title_match else url
                title = re.sub(r'\s+', ' ', title)

                # Body text extraction
                body = re.sub(r'<script[^>]*>.*?</script>', ' ', raw_html, flags=re.DOTALL | re.IGNORECASE)
                body = re.sub(r'<style[^>]*>.*?</style>', ' ', body, flags=re.DOTALL | re.IGNORECASE)
                body = re.sub(r'<nav[^>]*>.*?</nav>', ' ', body, flags=re.DOTALL | re.IGNORECASE)
                body = re.sub(r'<header[^>]*>.*?</header>', ' ', body, flags=re.DOTALL | re.IGNORECASE)
                body = re.sub(r'<footer[^>]*>.*?</footer>', ' ', body, flags=re.DOTALL | re.IGNORECASE)
                body = re.sub(r'<[^>]+>', ' ', body)
                clean_text = ' '.join(body.split())[:2000]

                return {
                    "is_url": True,
                    "url": url,
                    "title": title,
                    "snippet": clean_text,
                    "success": True
                }
        except Exception as e:
            logger.warning(f"Failed to inspect URL {url}: {e}")
            return {
                "is_url": True,
                "url": url,
                "title": url,
                "snippet": f"Could not retrieve webpage directly: {e}",
                "success": False
            }

    @staticmethod
    def search_professor_or_organization(query: str) -> Optional[Dict[str, Any]]:
        """
        Searches the live web / Wikipedia knowledge base to verify whether
        the person (Professor, faculty, researcher) or organization exists,
        and details their affiliated university, department, or organization.
        """
        # Clean query of filler prompt words
        cleaned_query = re.sub(
            r'\b(is|part|of|the|organization|who|what|about|tell|me|can|you|check|verify|professor|prof|dr|doctor)\b',
            ' ',
            query,
            flags=re.IGNORECASE
        )
        cleaned_query = ' '.join(cleaned_query.split())
        if not cleaned_query:
            cleaned_query = query.strip()

        try:
            encoded = urllib.parse.quote(cleaned_query)
            search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={encoded}&format=json"
            req = urllib.request.Request(search_url, headers={"User-Agent": USER_AGENT})
            
            with urllib.request.urlopen(req, timeout=6) as response:
                data = json.loads(response.read().decode("utf-8"))
                search_results = data.get("query", {}).get("search", [])
                
                if not search_results:
                    return None

                top_result = search_results[0]
                page_title = top_result.get("title", "")
                
                # Fetch detailed REST summary
                summary_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(page_title)}"
                sum_req = urllib.request.Request(summary_url, headers={"User-Agent": USER_AGENT})
                
                try:
                    with urllib.request.urlopen(sum_req, timeout=6) as sum_res:
                        sum_data = json.loads(sum_res.read().decode("utf-8"))
                        return {
                            "title": sum_data.get("title", page_title),
                            "description": sum_data.get("description", ""),
                            "extract": sum_data.get("extract", ""),
                            "url": sum_data.get("content_urls", {}).get("desktop", {}).get("page", f"https://en.wikipedia.org/wiki/{urllib.parse.quote(page_title)}"),
                            "raw_snippet": re.sub(r'<[^>]+>', '', top_result.get("snippet", ""))
                        }
                except Exception:
                    clean_snippet = re.sub(r'<[^>]+>', '', top_result.get("snippet", ""))
                    return {
                        "title": page_title,
                        "description": "Academic / Faculty Profile",
                        "extract": clean_snippet,
                        "url": f"https://en.wikipedia.org/wiki/{urllib.parse.quote(page_title)}",
                        "raw_snippet": clean_snippet
                    }
        except Exception as exc:
            logger.warning(f"Search lookup error for '{query}': {exc}")
            return None

web_search_service = WebSearchService()
