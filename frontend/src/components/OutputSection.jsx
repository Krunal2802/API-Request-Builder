import CodeBlock from './CodeBlock'

function OutputSection({ generatedCode, activeTab, onTabChange }) {
  const tabs = [
    { id: 'curl', label: 'CURL', language: 'bash' },
    { id: 'python', label: 'Python', language: 'python' },
    { id: 'javascript', label: 'JavaScript', language: 'javascript' },
    { id: 'postman', label: 'Postman Collection', language: 'json' }
  ]

  const handleDownloadPostman = () => {
    const dataStr = JSON.stringify(generatedCode.postman_collection, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'postman_collection.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getCode = () => {
    switch (activeTab) {
      case 'curl':
        return generatedCode.curl
      case 'python':
        return generatedCode.python
      case 'javascript':
        return generatedCode.javascript
      case 'postman':
        return JSON.stringify(generatedCode.postman_collection, null, 2)
      default:
        return ''
    }
  }

  const getLanguage = () => {
    const tab = tabs.find(t => t.id === activeTab)
    return tab ? tab.language : 'text'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Generated Code</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="mb-4">
        <CodeBlock code={getCode()} language={getLanguage()} />
      </div>

      {/* Download Button for Postman */}
      {activeTab === 'postman' && (
        <button
          onClick={handleDownloadPostman}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
        >
          Download Postman Collection
        </button>
      )}
    </div>
  )
}

export default OutputSection
