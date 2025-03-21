import React, { useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { Scene } from './components/Scene';
import { getAIResponse } from './services/ai';
import { useAvatarStore } from './store/avatarStore';

function App() {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { setSpeaking } = useAvatarStore();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setSpeaking(true);
    const response = await getAIResponse(input);
    // Here you would implement text-to-speech
    // and lip sync animation
    setSpeaking(false);
    setInput('');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Implement speech-to-text functionality
  };

  return (
    <div className="h-screen w-full bg-black text-white">
      <div className="relative h-full">
        <Scene />
        
        {/* Chat Interface */}
        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
          <div className="max-w-3xl mx-auto flex gap-2">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full ${
                isListening ? 'bg-red-500' : 'bg-gray-700'
              }`}
            >
              <Mic className="w-6 h-6" />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-800 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={handleSend}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;