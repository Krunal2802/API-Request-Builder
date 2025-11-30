import json
from typing import Dict, Any, Optional
from urllib.parse import urlencode

def generate_javascript(url: str, method: str, headers: Optional[Dict[str, str]] = None,
                        body: Optional[Any] = None, query_params: Optional[Dict[str, str]] = None) -> str:
    """Generate JavaScript fetch API code from API specification."""
    
    lines = []
    lines.append("// API Request")
    
    # Build URL with query parameters
    if query_params:
        lines.append("")
        lines.append("// Build URL with query parameters")
        lines.append(f"const baseUrl = {json.dumps(url)};")
        lines.append(f"const params = new URLSearchParams({json.dumps(query_params)});")
        lines.append("const url = `${baseUrl}?${params.toString()}`;")
    else:
        lines.append(f"const url = {json.dumps(url)};")
    
    # Build options object
    lines.append("")
    lines.append("// Request options")
    lines.append("const options = {")
    lines.append(f"  method: {json.dumps(method)},")
    
    # Add headers
    if headers:
        lines.append("  headers: {")
        for i, (key, value) in enumerate(headers.items()):
            comma = "," if i < len(headers) - 1 else ""
            lines.append(f"    {json.dumps(key)}: {json.dumps(value)}{comma}")
        lines.append("  },")
    
    # Add body (only for non-GET requests)
    if body is not None and method != "GET":
        if isinstance(body, (dict, list)):
            body_str = json.dumps(body, indent=2)
            # Indent the body properly
            body_lines = body_str.split('\n')
            lines.append("  body: JSON.stringify(")
            for i, line in enumerate(body_lines):
                if i == len(body_lines) - 1:
                    lines.append(f"    {line}")
                else:
                    lines.append(f"    {line}")
            lines.append("  )")
        else:
            lines.append(f"  body: {json.dumps(str(body))}")
    
    lines.append("};")
    
    # Make the fetch call
    lines.append("")
    lines.append("// Make the request")
    lines.append("fetch(url, options)")
    lines.append("  .then(response => response.json())")
    lines.append("  .then(data => console.log(data))")
    lines.append("  .catch(error => console.error('Error:', error));")
    
    return "\n".join(lines)
