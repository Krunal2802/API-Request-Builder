# Design Document

## Overview

The API Code Generator is a full-stack application consisting of a FastAPI backend and React frontend. The backend receives API specifications via REST endpoint, validates input using Pydantic models, and generates code snippets through specialized generator modules. The frontend provides an intuitive interface for inputting API details and displays generated code with syntax highlighting and copy/download functionality.

The architecture follows a clean separation of concerns with the backend handling all code generation logic and the frontend focusing purely on user interaction and presentation.

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph Frontend["React Frontend"]
        UI[User Interface]
        API_CLIENT[API Client]
    end
    
    subgraph Backend["FastAPI Backend"]
        ENDPOINT[/api/generate-code]
        VALIDATOR[Input Validator]
        ORCHESTRATOR[Generation Orchestrator]
        
        subgraph Generators["Code Generators"]
            CURL[CURL Generator]
            PYTHON[Python Generator]
            JS[JavaScript Generator]
            POSTMAN[Postman Generator]
        end
    end
    
    UI -->|User Input| API_CLIENT
    API_CLIENT -->|HTTP POST| ENDPOINT
    ENDPOINT -->|Validate| VALIDATOR
    VALIDATOR -->|Valid Input| ORCHESTRATOR
    ORCHESTRATOR -->|Delegate| CURL
    ORCHESTRATOR -->|Delegate| PYTHON
    ORCHESTRATOR -->|Delegate| JS
    ORCHESTRATOR -->|Delegate| POSTMAN
    ORCHESTRATOR -->|Aggregated Response| ENDPOINT
    ENDPOINT -->|JSON Response| API_CLIENT
    API_CLIENT -->|Display| UI
```

### Technology Stack

**Backend:**
- FastAPI: Web framework for building the REST API
- Pydantic: Data validation and settings management
- uvicorn: ASGI server for running FastAPI
- fastapi.middleware.cors: CORS middleware for cross-origin requests

**Frontend:**
- React 18+: UI library with hooks
- Axios: HTTP client for API requests
- Tailwind CSS: Utility-first CSS framework
- react-syntax-highlighter: Syntax highlighting for code blocks
- Vite: Build tool and development server

## Components and Interfaces

### Backend Components

#### 1. Main Application (main.py)

The FastAPI application entry point that configures CORS, registers routes, and handles global error handling.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API Code Generator")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 2. Pydantic Models (models.py)

Data models for request validation and response structure.

```python
from pydantic import BaseModel, Field, validator
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
```

#### 3. Code Generators

Each generator is a separate module with a single responsibility:

**CURL Generator (generators/curl_generator.py)**
- Escapes shell special characters
- Formats headers with -H flags
- Handles body data with -d flag
- Appends query parameters to URL

**Python Generator (generators/python_generator.py)**
- Generates requests library code
- Formats dictionaries for headers, params, and json
- Includes proper indentation
- Adds explanatory comments

**JavaScript Generator (generators/javascript_generator.py)**
- Generates fetch API code
- Constructs options object with method, headers, body
- Uses URLSearchParams for query parameters
- Includes async/await pattern with error handling

**Postman Generator (generators/postman_generator.py)**
- Creates Postman Collection v2.1 structure
- Formats headers as array of {key, value} objects
- Structures body based on content type
- Builds URL with query parameters

### Frontend Components

#### 1. App Component (App.jsx)

Root component that manages application state and coordinates child components.

**State:**
- `apiSpec`: Current API specification input
- `generatedCode`: Response from backend
- `loading`: Loading state indicator
- `error`: Error message if request fails
- `activeTab`: Currently selected output tab

**Methods:**
- `handleGenerate()`: Sends request to backend
- `handleInputChange()`: Updates apiSpec state
- `handleAddHeader()`: Adds new header row
- `handleRemoveHeader()`: Removes header row

#### 2. InputSection Component (components/InputSection.jsx)

Handles all user input for API specification.

**Props:**
- `apiSpec`: Current specification object
- `onChange`: Callback for input changes
- `onGenerate`: Callback for generate button
- `loading`: Loading state

**Sub-components:**
- URL input field
- Method dropdown
- Dynamic headers section with add/remove buttons
- Dynamic query parameters section
- Body textarea with JSON formatting

#### 3. OutputSection Component (components/OutputSection.jsx)

Displays generated code in tabbed interface.

**Props:**
- `generatedCode`: Object containing all code formats
- `activeTab`: Currently selected tab
- `onTabChange`: Callback for tab selection

**Features:**
- Tab navigation (CURL, Python, JavaScript, Postman)
- Copy button with feedback
- Download button for Postman collection
- Syntax highlighting per language

#### 4. CodeBlock Component (components/CodeBlock.jsx)

Reusable component for displaying code with syntax highlighting.

**Props:**
- `code`: String of code to display
- `language`: Programming language for highlighting
- `onCopy`: Callback for copy action

## Data Models

### API Specification Model

```typescript
interface APISpecification {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  query_params?: Record<string, string>;
}
```

### Generated Code Response Model

```typescript
interface GeneratedCodeResponse {
  curl: string;
  python: string;
  javascript: string;
  postman_collection: PostmanCollection;
}

interface PostmanCollection {
  info: {
    name: string;
    schema: string;
  };
  item: Array<{
    name: string;
    request: {
      method: string;
      header: Array<{key: string; value: string}>;
      url: {
        raw: string;
        protocol: string;
        host: string[];
        path: string[];
        query?: Array<{key: string; value: string}>;
      };
      body?: {
        mode: string;
        raw?: string;
      };
    };
  }>;
}
```

### Header/Query Parameter Model

```typescript
interface KeyValuePair {
  id: string;  // Unique identifier for React keys
  key: string;
  value: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Backend Code Generation Properties

**Property 1: Complete code generation**
*For any* valid API specification, the backend response should contain all four code formats (curl, python, javascript, postman_collection) with non-empty values.
**Validates: Requirements 1.1**

**Property 2: URL validation**
*For any* request without a URL field or with a non-string URL, the backend should reject it with a validation error.
**Validates: Requirements 1.2**

**Property 3: Method validation**
*For any* request with an HTTP method outside the set {GET, POST, PUT, DELETE, PATCH}, the backend should reject it with a 422 status code.
**Validates: Requirements 1.3, 2.2**

**Property 4: Optional field acceptance**
*For any* valid API specification with optional headers, body, or query_params fields in the correct format, the backend should accept the request successfully.
**Validates: Requirements 1.4, 1.5, 1.6**

**Property 5: Validation error details**
*For any* request that fails validation, the backend response should include the field name and error description.
**Validates: Requirements 2.1, 2.4**

**Property 6: CURL method inclusion**
*For any* valid API specification, the generated CURL command should contain the HTTP method with the -X flag.
**Validates: Requirements 3.1**

**Property 7: CURL header inclusion**
*For any* API specification with N headers, the generated CURL command should contain N instances of the -H flag, one for each header.
**Validates: Requirements 3.2**

**Property 8: CURL body inclusion**
*For any* API specification with a request body, the generated CURL command should contain the -d flag with the body content.
**Validates: Requirements 3.3**

**Property 9: CURL query parameter inclusion**
*For any* API specification with query parameters, the generated CURL command should include them in the URL with proper encoding.
**Validates: Requirements 3.4**

**Property 10: Python code validity**
*For any* valid API specification, the generated Python code should be syntactically valid and parseable by Python's ast module.
**Validates: Requirements 4.5**

**Property 11: Python requests library usage**
*For any* valid API specification, the generated Python code should contain a requests.<method> call with the appropriate HTTP method.
**Validates: Requirements 4.1**

**Property 12: Python headers parameter**
*For any* API specification with headers, the generated Python code should include a headers= parameter with a dictionary.
**Validates: Requirements 4.2**

**Property 13: Python body parameter**
*For any* API specification with a JSON body, the generated Python code should include a json= parameter.
**Validates: Requirements 4.3**

**Property 14: Python query parameter**
*For any* API specification with query parameters, the generated Python code should include a params= parameter.
**Validates: Requirements 4.4**

**Property 15: Python code comments**
*For any* valid API specification, the generated Python code should include at least one comment.
**Validates: Requirements 4.6**

**Property 16: JavaScript code validity**
*For any* valid API specification, the generated JavaScript code should be syntactically valid and parseable by a JavaScript parser.
**Validates: Requirements 5.5**

**Property 17: JavaScript fetch usage**
*For any* valid API specification, the generated JavaScript code should contain a fetch() call with the method in the options object.
**Validates: Requirements 5.1**

**Property 18: JavaScript headers inclusion**
*For any* API specification with headers, the generated JavaScript code should include them in the headers object of the fetch options.
**Validates: Requirements 5.2**

**Property 19: JavaScript body inclusion**
*For any* API specification with a body, the generated JavaScript code should include JSON.stringify and a body field in the fetch options.
**Validates: Requirements 5.3**

**Property 20: JavaScript query parameters**
*For any* API specification with query parameters, the generated JavaScript code should append them to the URL.
**Validates: Requirements 5.4**

**Property 21: JavaScript code comments**
*For any* valid API specification, the generated JavaScript code should include at least one comment.
**Validates: Requirements 5.6**

**Property 22: Postman collection validity**
*For any* valid API specification, the generated Postman collection should be valid JSON conforming to Postman Collection v2.1 schema.
**Validates: Requirements 6.1, 6.5**

**Property 23: Postman headers inclusion**
*For any* API specification with N headers, the generated Postman collection should have N entries in the request.header array.
**Validates: Requirements 6.2**

**Property 24: Postman body inclusion**
*For any* API specification with a body, the generated Postman collection should include it in the request.body field.
**Validates: Requirements 6.3**

**Property 25: Postman query parameters**
*For any* API specification with N query parameters, the generated Postman collection should have N entries in the url.query array.
**Validates: Requirements 6.4**

**Property 26: Bearer token formatting**
*For any* API specification with a Bearer token in headers, all four generated code formats should include the properly formatted Authorization header.
**Validates: Requirements 7.1**

**Property 27: Basic auth formatting**
*For any* API specification with Basic authentication in headers, all four generated code formats should include the properly formatted Authorization header.
**Validates: Requirements 7.2**

**Property 28: JSON body content type**
*For any* API specification with a JSON body, the generated code should set or use application/json content type.
**Validates: Requirements 8.1**

**Property 29: Form data encoding**
*For any* API specification with form data body type, the generated code should handle form encoding appropriately.
**Validates: Requirements 8.2**

**Property 30: GET method body omission**
*For any* API specification with method=GET, the generated code in all formats should not include a body, regardless of whether body is provided in the input.
**Validates: Requirements 8.3**

**Property 31: CORS headers presence**
*For any* request to the backend, the response should include Access-Control-Allow-Origin and Access-Control-Allow-Methods headers.
**Validates: Requirements 9.2, 9.3**

### Frontend UI Properties

**Property 32: Input field reactivity**
*For any* text input in the URL or body fields, the Frontend Application should update its state to reflect the input.
**Validates: Requirements 10.2, 10.6**

**Property 33: Method selection update**
*For any* method selection from the dropdown, the Frontend Application should update the selected method in state.
**Validates: Requirements 10.3**

**Property 34: Dynamic row addition**
*For any* click on the add button in headers or query parameters sections, the Frontend Application should add a new key-value pair input row.
**Validates: Requirements 10.4, 10.5**

**Property 35: Tab display**
*For any* generated code response, the Frontend Application should display all four tabs (CURL, Python, JavaScript, Postman Collection).
**Validates: Requirements 11.1**

**Property 36: Tab switching**
*For any* tab click, the Frontend Application should display the corresponding code snippet.
**Validates: Requirements 11.2**

**Property 37: Syntax highlighting application**
*For any* code displayed in the output section, the Frontend Application should apply syntax highlighting.
**Validates: Requirements 11.3**

**Property 38: Copy button visibility**
*For any* tab with code content, the Frontend Application should display a copy button.
**Validates: Requirements 11.4**

**Property 39: Clipboard copy**
*For any* copy button click, the Frontend Application should copy the displayed code to the system clipboard.
**Validates: Requirements 12.1**

**Property 40: Copy feedback display**
*For any* successful copy operation, the Frontend Application should display "Copied!" feedback and reset the button after a delay.
**Validates: Requirements 12.2, 12.3**

**Property 41: Postman download**
*For any* download button click in the Postman tab, the Frontend Application should trigger a file download with a .json extension.
**Validates: Requirements 13.1, 13.2, 13.3**

**Property 42: Loading state display**
*For any* generate button click, the Frontend Application should display a loading indicator until the response is received.
**Validates: Requirements 15.1**

**Property 43: Error message display**
*For any* backend error or network failure, the Frontend Application should display an error message to the user.
**Validates: Requirements 15.2, 15.3**

**Property 44: Input preservation on error**
*For any* error during code generation, the Frontend Application should maintain the user's input data.
**Validates: Requirements 15.4**

**Property 45: Hover feedback**
*For any* interactive element (buttons, tabs), the Frontend Application should provide visual feedback on hover.
**Validates: Requirements 17.3**

**Property 46: Form labels presence**
*For any* form input field, the Frontend Application should include a label or placeholder.
**Validates: Requirements 17.4**

## Error Handling

### Backend Error Handling

**Validation Errors (422 Unprocessable Entity)**
- Missing required fields (url, method)
- Invalid HTTP method
- Invalid data types for fields
- Response includes field name and error description

**Malformed Request (400 Bad Request)**
- Invalid JSON in request body
- Response includes error message

**Server Errors (500 Internal Server Error)**
- Unexpected errors during code generation
- Logged for debugging
- Generic error message returned to client

**Error Response Format:**
```json
{
  "detail": [
    {
      "loc": ["body", "method"],
      "msg": "value is not a valid enumeration member",
      "type": "type_error.enum"
    }
  ]
}
```

### Frontend Error Handling

**Network Errors**
- Display: "Unable to connect to the server. Please check your connection."
- Preserve user input for retry

**Backend Validation Errors**
- Parse error response
- Display field-specific error messages
- Highlight problematic fields

**Unexpected Errors**
- Display: "An unexpected error occurred. Please try again."
- Log error to console for debugging

**Error Display Component**
- Red background with error icon
- Clear, user-friendly message
- Dismissible or auto-dismiss after timeout

## Testing Strategy

### Backend Testing

**Unit Tests**
- Test each generator module independently with sample inputs
- Test Pydantic model validation with valid and invalid inputs
- Test edge cases: empty strings, special characters, very long URLs
- Test authentication header formatting (Bearer, Basic, API Key)
- Test body type handling (JSON vs form data)
- Test GET request body omission

**Property-Based Tests**

The backend will use **Hypothesis** (Python property-based testing library) to verify correctness properties. Each property-based test will:
- Run a minimum of 100 iterations with randomly generated inputs
- Be tagged with a comment referencing the specific correctness property from this design document
- Use the format: `# Feature: api-code-generator, Property {number}: {property_text}`

Property-based tests will cover:
- Code generation completeness (Property 1)
- Input validation (Properties 2-5)
- CURL generation (Properties 6-9)
- Python generation (Properties 10-15)
- JavaScript generation (Properties 16-21)
- Postman generation (Properties 22-25)
- Authentication handling (Properties 26-27)
- Body type handling (Properties 28-30)
- CORS headers (Property 31)

**Integration Tests**
- Test full request/response cycle through FastAPI test client
- Test CORS middleware configuration
- Test error handling for various failure scenarios

### Frontend Testing

**Unit Tests**
- Test component rendering with various props
- Test state management in App component
- Test input change handlers
- Test API client functions
- Test clipboard copy functionality
- Test file download functionality

**Property-Based Tests**

The frontend will use **fast-check** (JavaScript property-based testing library) to verify UI properties. Each property-based test will:
- Run a minimum of 100 iterations with randomly generated inputs
- Be tagged with a comment referencing the specific correctness property from this design document
- Use the format: `// Feature: api-code-generator, Property {number}: {property_text}`

Property-based tests will cover:
- Input field reactivity (Property 32)
- Method selection (Property 33)
- Dynamic row addition (Property 34)
- Tab display and switching (Properties 35-36)
- Copy and download functionality (Properties 39-41)
- Error handling (Properties 43-44)

**Integration Tests**
- Test complete user flow: input → generate → display → copy
- Test error scenarios with mocked API responses
- Test responsive behavior at different screen sizes

**End-to-End Tests**
- Test full application flow with real backend
- Test example data pre-population
- Test generated code execution (verify CURL, Python, JS code actually works)

## Implementation Notes

### Code Generation Best Practices

1. **Escaping and Encoding**
   - CURL: Escape shell special characters ($, `, \, ", ', etc.)
   - Python: Use repr() for string literals to handle quotes
   - JavaScript: Use JSON.stringify for proper escaping
   - URLs: Use urllib.parse.quote for query parameters

2. **Code Formatting**
   - Consistent indentation (4 spaces for Python, 2 for JavaScript)
   - Line length limits (80-100 characters)
   - Proper spacing around operators and after commas

3. **Comments**
   - Include import statements in generated code
   - Add comments explaining authentication headers
   - Note any assumptions or requirements

### Frontend State Management

The application uses React hooks for state management:
- `useState` for component-level state
- `useEffect` for side effects (loading example data)
- `useCallback` for memoized callbacks
- No external state management library needed for this scope

### API Client Configuration

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
```

### Syntax Highlighting Configuration

Using `react-syntax-highlighter` with Prism:
- CURL: bash language
- Python: python language
- JavaScript: javascript language
- Postman: json language

Theme: VS Code Dark+ or similar modern dark theme

## Performance Considerations

### Backend
- Code generation is CPU-bound but fast (< 100ms for typical requests)
- No caching needed for MVP
- Consider rate limiting for production deployment

### Frontend
- Lazy load syntax highlighter to reduce initial bundle size
- Debounce input changes if implementing live preview
- Memoize generated code display to prevent unnecessary re-renders

## Security Considerations

### Backend
- Input validation prevents injection attacks
- No execution of user-provided code
- CORS configured to allow all origins (restrict in production)
- No sensitive data stored or logged

### Frontend
- Sanitize user input before display (React handles this by default)
- Use HTTPS in production
- No sensitive data in localStorage
- Content Security Policy headers recommended

## Deployment Considerations

### Backend
- Deploy on cloud platform (AWS, GCP, Heroku, Railway)
- Use environment variables for configuration
- Enable HTTPS
- Configure CORS for specific frontend domain
- Set up logging and monitoring

### Frontend
- Build optimized production bundle
- Deploy to static hosting (Vercel, Netlify, Cloudflare Pages)
- Configure environment variables for API URL
- Enable CDN for faster global access

## Future Enhancements

1. **Additional Language Support**
   - Go (net/http)
   - Ruby (net/http)
   - PHP (cURL)
   - Java (HttpClient)

2. **Advanced Features**
   - Save/load API specifications
   - History of generated code
   - Share generated code via URL
   - Export as Insomnia collection
   - GraphQL support

3. **UI Improvements**
   - Dark/light theme toggle
   - Code diff view for comparing formats
   - Live preview as you type
   - Keyboard shortcuts
   - Drag-and-drop for headers/params reordering

4. **Testing Features**
   - Execute generated code directly in browser
   - Test API endpoint before generating code
   - Response preview
