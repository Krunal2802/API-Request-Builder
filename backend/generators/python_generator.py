import json
from typing import Dict, Any, Optional

def generate_python(url: str, method: str, headers: Optional[Dict[str, str]] = None,
                    body: Optional[Any] = None, query_params: Optional[Dict[str, str]] = None) -> str:
    """Generate Python requests library code from API specification."""
    
    lines = []
    lines.append("import requests")
    lines.append("")
    lines.append("# API Request")
    lines.append(f"url = {repr(url)}")
    
    # Build the request call
    method_lower = method.lower()
    params = []
    
    # Add headers
    if headers:
        lines.append("")
        lines.append("# Headers")
        lines.append(f"headers = {json.dumps(headers, indent=4)}")
        params.append("headers=headers")
    
    # Add query parameters
    if query_params:
        lines.append("")
        lines.append("# Query parameters")
        lines.append(f"params = {json.dumps(query_params, indent=4)}")
        params.append("params=params")
    
    # Add body (only for non-GET requests)
    if body is not None and method != "GET":
        lines.append("")
        lines.append("# Request body")
        if isinstance(body, (dict, list)):
            lines.append(f"json_data = {json.dumps(body, indent=4)}")
            params.append("json=json_data")
        else:
            lines.append(f"data = {repr(body)}")
            params.append("data=data")
    
    # Build the request call
    lines.append("")
    params_str = ", ".join(params)
    if params_str:
        lines.append(f"response = requests.{method_lower}(url, {params_str})")
    else:
        lines.append(f"response = requests.{method_lower}(url)")
    
    lines.append("")
    lines.append("# Print response")
    lines.append("print(response.status_code)")
    lines.append("print(response.json())")
    
    return "\n".join(lines)
