import { useState, useEffect } from 'react'
import axios from 'axios'
import InputSection from './components/InputSection'
import OutputSection from './components/OutputSection'

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // In production (when served from same domain), use relative URLs
  if (import.meta.env.PROD) {
    return ''
  }
  
  // Development fallback
  return 'http://localhost:8000'
}

const API_BASE_URL = getApiBaseUrl()

function App() {
  const [apiSpec, setApiSpec] = useState({
    url: '',
    method: 'GET',
    headers: [{ id: '1', key: '', value: '' }],
    query_params: [{ id: '1', key: '', value: '' }],
    body: ''
  })
  
  const [generatedCode, setGeneratedCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('curl')

  // Load example data on mount
  useEffect(() => {
    setApiSpec({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'POST',
      headers: [
        { id: '1', key: 'Content-Type', value: 'application/json' },
        { id: '2', key: 'Authorization', value: 'Bearer token123' }
      ],
      query_params: [{ id: '1', key: '', value: '' }],
      body: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1
      }, null, 2)
    })
  }, [])

  const handleInputChange = (field, value) => {
    setApiSpec(prev => ({ ...prev, [field]: value }))
  }

  const handleAddHeader = () => {
    setApiSpec(prev => ({
      ...prev,
      headers: [...prev.headers, { id: Date.now().toString(), key: '', value: '' }]
    }))
  }

  const handleRemoveHeader = (id) => {
    setApiSpec(prev => ({
      ...prev,
      headers: prev.headers.filter(h => h.id !== id)
    }))
  }

  const handleHeaderChange = (id, field, value) => {
    setApiSpec(prev => ({
      ...prev,
      headers: prev.headers.map(h => 
        h.id === id ? { ...h, [field]: value } : h
      )
    }))
  }

  const handleAddQueryParam = () => {
    setApiSpec(prev => ({
      ...prev,
      query_params: [...prev.query_params, { id: Date.now().toString(), key: '', value: '' }]
    }))
  }

  const handleRemoveQueryParam = (id) => {
    setApiSpec(prev => ({
      ...prev,
      query_params: prev.query_params.filter(q => q.id !== id)
    }))
  }

  const handleQueryParamChange = (id, field, value) => {
    setApiSpec(prev => ({
      ...prev,
      query_params: prev.query_params.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    }))
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    
    // Debug logging
    console.log('API_BASE_URL:', API_BASE_URL)
    console.log('Environment:', import.meta.env.MODE)
    console.log('Is Production:', import.meta.env.PROD)
    
    try {
      // Convert headers and query_params arrays to objects
      const headers = {}
      apiSpec.headers.forEach(h => {
        if (h.key) headers[h.key] = h.value
      })
      
      const query_params = {}
      apiSpec.query_params.forEach(q => {
        if (q.key) query_params[q.key] = q.value
      })
      
      // Parse body if it's JSON
      let body = apiSpec.body
      if (body) {
        try {
          body = JSON.parse(body)
        } catch {
          // Keep as string if not valid JSON
        }
      }
      
      const payload = {
        url: apiSpec.url,
        method: apiSpec.method,
        headers: Object.keys(headers).length > 0 ? headers : null,
        body: body || null,
        query_params: Object.keys(query_params).length > 0 ? query_params : null
      }
      
      const apiUrl = `${API_BASE_URL}/api/generate-code`
      console.log('Making API call to:', apiUrl)
      console.log('Payload:', payload)
      
      const response = await axios.post(apiUrl, payload)
      setGeneratedCode(response.data)
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || 'Error generating code')
      } else if (err.request) {
        setError('Unable to connect to the server. Please check your connection.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">API Code Generator</h1>
          <p className="text-gray-600">Convert API specifications into ready-to-use code snippets</p>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputSection
            apiSpec={apiSpec}
            onInputChange={handleInputChange}
            onHeaderChange={handleHeaderChange}
            onAddHeader={handleAddHeader}
            onRemoveHeader={handleRemoveHeader}
            onQueryParamChange={handleQueryParamChange}
            onAddQueryParam={handleAddQueryParam}
            onRemoveQueryParam={handleRemoveQueryParam}
            onGenerate={handleGenerate}
            loading={loading}
          />

          {generatedCode && (
            <OutputSection
              generatedCode={generatedCode}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
