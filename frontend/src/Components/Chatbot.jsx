import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState('en');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/patient/chatbot', { symptoms: input, language }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResponse(res.data.summary || 'No response from chatbot');
    } catch (error) {
      console.error('Chatbot error:', error);
      setResponse('Error getting response');
    }
  };

  return (
    <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Chatbot Assistance</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms..."
          className="border p-2 rounded"
          rows="4"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="kn">Kannada</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Get Advice
        </button>
      </form>
      {response && <p className="mt-2">{response}</p>}
    </div>
  );
};

export default Chatbot;