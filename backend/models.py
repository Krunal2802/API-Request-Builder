from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Literal

class APISpecification(BaseModel):
    url: str = Field(..., description="API endpoint URL")
    method: Literal["GET", "POST", "PUT", "DELETE", "PATCH"]
    headers: Optional[Dict[str, str]] = None
    body: Optional[Any] = None
    query_params: Optional[Dict[str, str]] = None

class CodeGenerationResponse(BaseModel):
    curl: str
    python: str
    javascript: str
    postman_collection: Dict[str, Any]
