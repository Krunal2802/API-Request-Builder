from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import APISpecification, CodeGenerationResponse
from generators.curl_generator import generate_curl
from generators.python_generator import generate_python
from generators.javascript_generator import generate_javascript
from generators.postman_generator import generate_postman

app = FastAPI(
    title="API Code Generator",
    description="Convert API specifications into ready-to-use code snippets",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API Code Generator is running"}

@app.post("/api/generate-code", response_model=CodeGenerationResponse)
async def generate_code(spec: APISpecification):
    """Generate code snippets from API specification."""
    try:
        # Generate code in all formats
        curl_code = generate_curl(
            url=spec.url,
            method=spec.method,
            headers=spec.headers,
            body=spec.body,
            query_params=spec.query_params
        )
        
        python_code = generate_python(
            url=spec.url,
            method=spec.method,
            headers=spec.headers,
            body=spec.body,
            query_params=spec.query_params
        )
        
        javascript_code = generate_javascript(
            url=spec.url,
            method=spec.method,
            headers=spec.headers,
            body=spec.body,
            query_params=spec.query_params
        )
        
        postman_collection = generate_postman(
            url=spec.url,
            method=spec.method,
            headers=spec.headers,
            body=spec.body,
            query_params=spec.query_params
        )
        
        return CodeGenerationResponse(
            curl=curl_code,
            python=python_code,
            javascript=javascript_code,
            postman_collection=postman_collection
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating code: {str(e)}")
