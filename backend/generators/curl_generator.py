import json
import shlex
from urllib.parse import urlencode
from typing import Dict, Any, Optional

def generate_curl(url: str, method: str, headers: Optional[Dict[str, str]] = None, 
                  body: Optional[Any] = None, query_params: Optional[Dict[str, str]] = None) -> str:
    """Generate a CURL command from API specification."""
    
    # Build URL with query parameters
    full_url = url
    if query_params:
        query_string = urlencode(query_params)
        separator = '&' if '?' in url else '?'
        full_url = f"{url}{separator}{query_string}"
    
    # Start building the curl command
    parts = ["curl", "-X", method]
    
    # Add headers
    if headers:
        for key, value in headers.items():
            parts.extend(["-H", f"{key}: {value}"])
    
    # Add body for non-GET requests
    if body is not None and method != "GET":
        if isinstance(body, (dict, list)):
            body_str = json.dumps(body)
        else:
            body_str = str(body)
        parts.extend(["-d", body_str])
    
    # Add URL (quoted)
    parts.append(full_url)
    
    # Use shlex.join for proper shell escaping
    return " ".join(shlex.quote(part) for part in parts)
