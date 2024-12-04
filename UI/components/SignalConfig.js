import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const SignalConfig = ({ initialPatterns, onSave }) => {
  const [patterns, setPatterns] = useState(initialPatterns || []);
  const [newPattern, setNewPattern] = useState({
    name: '',
    pattern: '',
    isActive: true
  });

  const handleAddPattern = () => {
    if (newPattern.name && newPattern.pattern) {
      setPatterns([...patterns, { ...newPattern, id: Date.now() }]);
      setNewPattern({ name: '', pattern: '', isActive: true });
    }
  };

  const handleDeletePattern = (id) => {
    setPatterns(patterns.filter(p => p.id !== id));
  };

  const handleTogglePattern = (id) => {
    setPatterns(patterns.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleSave = () => {
    onSave(patterns);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add New Pattern */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add New Pattern</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={newPattern.name}
                  onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
                  placeholder="e.g., Long Signal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pattern (Regex)</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={newPattern.pattern}
                  onChange={(e) => setNewPattern({ ...newPattern, pattern: e.target.value })}
                  placeholder="e.g., LONG[:\s]*(\w+).*Entry[:\s]*(\d+\.?\d*)"
                />
              </div>
              <button
                onClick={handleAddPattern}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add Pattern
              </button>
            </div>
          </div>

          {/* Existing Patterns */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Existing Patterns</h3>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div key={pattern.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{pattern.name}</p>
                    <p className="text-sm text-gray-500">{pattern.pattern}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTogglePattern(pattern.id)}
                      className={`px-3 py-1 rounded ${pattern.isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                      {pattern.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDeletePattern(pattern.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
