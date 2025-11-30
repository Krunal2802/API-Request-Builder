# API Code Generator

A full-stack application that converts API specifications into ready-to-use code snippets in multiple languages and formats.

## Features

- **Multiple Code Formats**: Generate CURL commands, Python requests code, JavaScript fetch code, and Postman Collections
- **Interactive UI**: Clean, modern interface with real-time code generation
- **Syntax Highlighting**: Beautiful code display with syntax highlighting for each language
- **Copy & Download**: One-click copy to clipboard and download Postman collections
- **Example Pre-loaded**: Starts with a working example to help you get started quickly
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **react-syntax-highlighter**: Code syntax highlighting

## Project Structure

```
project/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── models.py               # Pydantic models
│   ├── generators/             # Code generation modules
│   │   ├── curl_generator.py
│   │   ├── python_generator.py
│   │   ├── javascript_generator.py
│   │   └── postman_generator.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── components/
│   │   │   ├── InputSection.jsx
│   │   │   ├── OutputSection.jsx
│   │   │   └── CodeBlock.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
  ```bash
  venv\Scripts\activate
  ```
- macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Start both servers** (backend and frontend)
2. **Open your browser** to `http://localhost:3000`
3. **Enter your API details**:
   - URL (required)
   - HTTP Method (GET, POST, PUT, DELETE, PATCH)
   - Headers (optional, add multiple)
   - Query Parameters (optional, add multiple)
   - Request Body (optional, JSON format)
4. **Click "Generate Code"**
5. **View generated code** in multiple formats via tabs
6. **Copy code** to clipboard or **download** Postman collection

## API Documentation

### POST /api/generate-code

Generate code snippets from API specification.

**Request Body:**
```json
{
  "url": "https://api.example.com/users",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123"
  },
  "body": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "query_params": {
    "page": "1",
    "limit": "10"
  }
}
```

**Response:**
```json
{
  "curl": "curl command here",
  "python": "Python requests code here",
  "javascript": "JavaScript fetch code here",
  "postman_collection": { "postman JSON object" }
}
```

**Status Codes:**
- `200`: Success
- `422`: Validation error (missing required fields, invalid method, etc.)
- `500`: Server error

## Example Use Case

**Input:**
- URL: `https://jsonplaceholder.typicode.com/posts`
- Method: `POST`
- Headers: `{"Content-Type": "application/json"}`
- Body: `{"title": "foo", "body": "bar", "userId": 1}`

**Generated CURL:**
```bash
curl -X POST -H 'Content-Type: application/json' -d '{"title": "foo", "body": "bar", "userId": 1}' https://jsonplaceholder.typicode.com/posts
```

**Generated Python:**
```python
import requests

url = "https://jsonplaceholder.typicode.com/posts"
headers = {"Content-Type": "application/json"}
json_data = {"title": "foo", "body": "bar", "userId": 1}

response = requests.post(url, headers=headers, json=json_data)
print(response.status_code)
print(response.json())
```

## Features in Detail

### Code Generation
- **CURL**: Shell-escaped commands ready to run in terminal
- **Python**: Uses requests library with proper formatting
- **JavaScript**: Modern fetch API with async/await
- **Postman**: v2.1 collection format for direct import

### Input Validation
- URL and method are required
- Method must be one of: GET, POST, PUT, DELETE, PATCH
- Headers and query parameters are optional
- Body is optional and can be JSON or string

### Error Handling
- Clear error messages for validation failures
- Network error handling with user-friendly messages
- Input preservation on errors for easy correction

### UI/UX
- Pre-loaded example for quick start
- Dynamic header and query parameter rows
- Syntax highlighting for better readability
- Copy to clipboard with visual feedback
- Download Postman collections as JSON files
- Responsive design for all screen sizes

## Development

### Backend Development

Run with auto-reload:
```bash
uvicorn main:app --reload
```

### Frontend Development

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.
