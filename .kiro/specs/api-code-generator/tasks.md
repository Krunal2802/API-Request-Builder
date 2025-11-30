# Implementation Plan

- [x] 1. Set up backend project structure


  - Create backend directory with FastAPI project structure
  - Create requirements.txt with dependencies (fastapi, uvicorn, pydantic, hypothesis for testing)
  - Create main.py with basic FastAPI app and CORS configuration
  - Create models.py for Pydantic models
  - Create generators directory for code generation modules
  - _Requirements: 1.1, 9.1, 9.2, 9.3_

- [x] 2. Implement Pydantic models and validation

  - [x] 2.1 Create APISpecification model with field validation


    - Define url, method, headers, body, query_params fields
    - Add method validator to restrict to valid HTTP methods
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [x] 2.2 Create CodeGenerationResponse model

    - Define curl, python, javascript, postman_collection fields
    - _Requirements: 1.1_
  
  - [ ]* 2.3 Write property test for input validation
    - **Property 2: URL validation**
    - **Property 3: Method validation**
    - **Validates: Requirements 1.2, 1.3, 2.2**

- [x] 3. Implement CURL generator

  - [x] 3.1 Create curl_generator.py module


    - Implement function to generate CURL command from APISpecification
    - Handle method with -X flag
    - Handle headers with -H flags
    - Handle body with -d flag
    - Handle query parameters in URL
    - Implement shell escaping for special characters
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 3.2 Write property tests for CURL generation
    - **Property 6: CURL method inclusion**
    - **Property 7: CURL header inclusion**
    - **Property 8: CURL body inclusion**
    - **Property 9: CURL query parameter inclusion**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 4. Implement Python generator

  - [x] 4.1 Create python_generator.py module


    - Implement function to generate Python requests code
    - Use appropriate requests method (get, post, put, delete, patch)
    - Format headers as dictionary
    - Format body as json parameter
    - Format query params as params parameter
    - Add proper indentation and comments
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ]* 4.2 Write property tests for Python generation
    - **Property 10: Python code validity**
    - **Property 11: Python requests library usage**
    - **Property 12: Python headers parameter**
    - **Property 13: Python body parameter**
    - **Property 14: Python query parameter**
    - **Property 15: Python code comments**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

- [x] 5. Implement JavaScript generator

  - [x] 5.1 Create javascript_generator.py module


    - Implement function to generate JavaScript fetch code
    - Use fetch API with method in options
    - Format headers object
    - Handle body with JSON.stringify
    - Append query parameters to URL
    - Add proper formatting and comments
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 5.2 Write property tests for JavaScript generation
    - **Property 16: JavaScript code validity**
    - **Property 17: JavaScript fetch usage**
    - **Property 18: JavaScript headers inclusion**
    - **Property 19: JavaScript body inclusion**
    - **Property 20: JavaScript query parameters**
    - **Property 21: JavaScript code comments**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**

- [x] 6. Implement Postman generator

  - [x] 6.1 Create postman_generator.py module


    - Implement function to generate Postman Collection v2.1 JSON
    - Create collection info structure
    - Format headers as array of {key, value} objects
    - Format body with appropriate mode
    - Format URL with query array
    - Ensure valid JSON structure
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 6.2 Write property tests for Postman generation
    - **Property 22: Postman collection validity**
    - **Property 23: Postman headers inclusion**
    - **Property 24: Postman body inclusion**
    - **Property 25: Postman query parameters**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 7. Implement authentication and body type handling

  - [x] 7.1 Add authentication header formatting to all generators


    - Handle Bearer token format
    - Handle Basic auth format
    - Handle API key headers
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 7.2 Add body type handling to all generators

    - Detect JSON vs form data from headers
    - Format appropriately in each generator
    - Omit body for GET requests
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ]* 7.3 Write property tests for authentication and body handling
    - **Property 26: Bearer token formatting**
    - **Property 27: Basic auth formatting**
    - **Property 28: JSON body content type**
    - **Property 29: Form data encoding**
    - **Property 30: GET method body omission**
    - **Validates: Requirements 7.1, 7.2, 8.1, 8.2, 8.3**

- [x] 8. Implement main API endpoint

  - [x] 8.1 Create POST /api/generate-code endpoint in main.py


    - Accept APISpecification as request body
    - Call all four generators
    - Aggregate results into CodeGenerationResponse
    - Handle validation errors with proper status codes
    - Handle unexpected errors with 500 status
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 8.2 Write property tests for endpoint
    - **Property 1: Complete code generation**
    - **Property 4: Optional field acceptance**
    - **Property 5: Validation error details**
    - **Property 31: CORS headers presence**
    - **Validates: Requirements 1.1, 1.4, 1.5, 1.6, 2.1, 2.4, 9.2, 9.3**

- [ ] 9. Checkpoint - Backend complete
  - Ensure all tests pass, ask the user if questions arise

- [x] 10. Set up frontend project structure


  - Create frontend directory with React + Vite project
  - Install dependencies (react, axios, tailwind, react-syntax-highlighter, fast-check for testing)
  - Configure Tailwind CSS
  - Create components directory
  - Set up environment variables for API URL
  - _Requirements: 10.1_

- [x] 11. Implement App component and state management

  - [x] 11.1 Create App.jsx with state management


    - Define state for apiSpec (url, method, headers, query_params, body)
    - Define state for generatedCode, loading, error, activeTab
    - Implement handleGenerate function to call backend API
    - Implement handleInputChange for form inputs
    - Implement handleAddHeader and handleRemoveHeader
    - Implement handleAddQueryParam and handleRemoveQueryParam
    - Load example API specification on mount
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 14.1, 14.2, 15.1_
  
  - [ ]* 11.2 Write property tests for App state management
    - **Property 32: Input field reactivity**
    - **Property 33: Method selection update**
    - **Property 34: Dynamic row addition**
    - **Validates: Requirements 10.2, 10.3, 10.4, 10.5**

- [x] 12. Implement InputSection component

  - [x] 12.1 Create InputSection.jsx component


    - Create URL input field with label
    - Create method dropdown with all HTTP methods
    - Create dynamic headers section with add/remove buttons
    - Create dynamic query parameters section with add/remove buttons
    - Create body textarea with label
    - Create generate button with loading state
    - Apply Tailwind styling for clean, modern UI
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 17.1, 17.2, 17.3, 17.4_
  
  - [ ]* 12.2 Write unit tests for InputSection
    - Test rendering with various props
    - Test input change callbacks
    - Test add/remove button functionality
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 13. Implement CodeBlock component

  - [x] 13.1 Create CodeBlock.jsx component


    - Accept code and language as props
    - Integrate react-syntax-highlighter with Prism
    - Add copy button with clipboard API
    - Show "Copied!" feedback on successful copy
    - Reset button state after delay
    - Apply syntax highlighting theme
    - _Requirements: 11.3, 11.4, 12.1, 12.2, 12.3_
  
  - [ ]* 13.2 Write property tests for CodeBlock
    - **Property 37: Syntax highlighting application**
    - **Property 38: Copy button visibility**
    - **Property 39: Clipboard copy**
    - **Property 40: Copy feedback display**
    - **Validates: Requirements 11.3, 11.4, 12.1, 12.2, 12.3**

- [x] 14. Implement OutputSection component

  - [x] 14.1 Create OutputSection.jsx component


    - Create tabbed interface with four tabs (CURL, Python, JavaScript, Postman)
    - Implement tab switching logic
    - Display CodeBlock for each tab
    - Add download button for Postman Collection tab
    - Implement file download functionality
    - Apply Tailwind styling for tabs
    - _Requirements: 11.1, 11.2, 13.1, 13.2, 13.3_
  
  - [ ]* 14.2 Write property tests for OutputSection
    - **Property 35: Tab display**
    - **Property 36: Tab switching**
    - **Property 41: Postman download**
    - **Validates: Requirements 11.1, 11.2, 13.1, 13.2, 13.3**

- [x] 15. Implement error handling and loading states

  - [x] 15.1 Add error handling to App component

    - Display error messages from backend validation errors
    - Display error messages from network failures
    - Preserve user input on error
    - Add error display component with styling
    - _Requirements: 15.2, 15.3, 15.4_
  
  - [x] 15.2 Add loading indicator

    - Show loading spinner or skeleton during API call
    - Disable generate button while loading
    - _Requirements: 15.1_
  
  - [ ]* 15.3 Write property tests for error handling
    - **Property 42: Loading state display**
    - **Property 43: Error message display**
    - **Property 44: Input preservation on error**
    - **Validates: Requirements 15.1, 15.2, 15.3, 15.4**

- [x] 16. Implement responsive design

  - [x] 16.1 Add responsive Tailwind classes

    - Make layout responsive for desktop, tablet, mobile
    - Stack components vertically on mobile
    - Adjust spacing and sizing for different screens
    - Test at various breakpoints
    - _Requirements: 16.1, 16.2, 16.3_
  
  - [x] 16.2 Add hover states and visual feedback

    - Add hover effects to buttons and tabs
    - Add focus states to inputs
    - Ensure interactive elements have clear feedback
    - _Requirements: 17.3_
  
  - [ ]* 16.3 Write tests for responsive behavior
    - **Property 45: Hover feedback**
    - **Property 46: Form labels presence**
    - **Validates: Requirements 17.3, 17.4**

- [x] 17. Final integration and polish

  - [x] 17.1 Connect frontend to backend

    - Configure API client with correct backend URL
    - Test full request/response flow
    - Handle CORS issues if any
    - _Requirements: 1.1, 9.1, 9.2, 9.3_
  
  - [x] 17.2 Add example data pre-population

    - Create sample API specification (e.g., JSONPlaceholder)
    - Load on component mount
    - _Requirements: 14.1, 14.2_
  
  - [x] 17.3 Final UI polish

    - Ensure consistent spacing and typography
    - Verify all labels and placeholders are clear
    - Test all interactive elements
    - _Requirements: 17.1, 17.2, 17.4_

- [x] 18. Create documentation


  - [x] 18.1 Create README.md


    - Add project overview
    - Add setup instructions for backend
    - Add setup instructions for frontend
    - Add usage examples
    - Add API documentation
    - Add screenshots or demo GIF
    - _Requirements: All_

- [ ] 19. Final checkpoint - All tests passing
  - Ensure all tests pass, ask the user if questions arise
