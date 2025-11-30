function InputSection({
  apiSpec,
  onInputChange,
  onHeaderChange,
  onAddHeader,
  onRemoveHeader,
  onQueryParamChange,
  onAddQueryParam,
  onRemoveQueryParam,
  onGenerate,
  loading
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">API Specification</h2>

      {/* URL Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL *
        </label>
        <input
          type="text"
          value={apiSpec.url}
          onChange={(e) => onInputChange('url', e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Method Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Method *
        </label>
        <select
          value={apiSpec.method}
          onChange={(e) => onInputChange('method', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      {/* Headers Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Headers
          </label>
          <button
            onClick={onAddHeader}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Header
          </button>
        </div>
        <div className="space-y-2">
          {apiSpec.headers.map((header) => (
            <div key={header.id} className="flex gap-2">
              <input
                type="text"
                value={header.key}
                onChange={(e) => onHeaderChange(header.id, 'key', e.target.value)}
                placeholder="Key"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <input
                type="text"
                value={header.value}
                onChange={(e) => onHeaderChange(header.id, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {apiSpec.headers.length > 1 && (
                <button
                  onClick={() => onRemoveHeader(header.id)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Query Parameters Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Query Parameters
          </label>
          <button
            onClick={onAddQueryParam}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Parameter
          </button>
        </div>
        <div className="space-y-2">
          {apiSpec.query_params.map((param) => (
            <div key={param.id} className="flex gap-2">
              <input
                type="text"
                value={param.key}
                onChange={(e) => onQueryParamChange(param.id, 'key', e.target.value)}
                placeholder="Key"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <input
                type="text"
                value={param.value}
                onChange={(e) => onQueryParamChange(param.id, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {apiSpec.query_params.length > 1 && (
                <button
                  onClick={() => onRemoveQueryParam(param.id)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Body Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Body (JSON)
        </label>
        <textarea
          value={apiSpec.body}
          onChange={(e) => onInputChange('body', e.target.value)}
          placeholder='{"key": "value"}'
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={loading || !apiSpec.url}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Code'}
      </button>
    </div>
  )
}

export default InputSection
