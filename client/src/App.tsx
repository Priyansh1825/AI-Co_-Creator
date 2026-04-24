import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<{role: string, content: string}[]>([]);
  // New state to hold the extracted document
  const [documentContent, setDocumentContent] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newChat = [...chatLog, { role: 'user', content: input }];
    setChatLog(newChat);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: newChat })
      });
      
      const data = await response.json();
      const aiReply = data.reply;

      // Detect the secret handshake!
      if (aiReply.includes('[FINAL_DOCUMENT]')) {
        const parts = aiReply.split('[FINAL_DOCUMENT]');
        const chatMessage = parts[0].trim();
        const documentMarkdown = parts[1].trim();

        // Update chat with just the conversational part
        setChatLog(prev => [...prev, { role: 'ai', content: chatMessage }]);
        // Update the right panel with the actual document
        setDocumentContent(documentMarkdown);
      } else {
        // Normal conversation, just update the chat
        setChatLog(prev => [...prev, { role: 'ai', content: aiReply }]);
      }

    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif' }}>
      
      {/* Left Panel: Chat Interface */}
      <div style={{ flex: 1, borderRight: '2px solid #ccc', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', backgroundColor: '#1a3a5c', color: 'white' }}>
          <h2 style={{ margin: 0 }}>AI Co-Creator</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {chatLog.map((msg, idx) => (
            <div key={idx} style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
              backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
              padding: '12px',
              borderRadius: '8px',
              maxWidth: '80%'
            }}>
              <strong>{msg.role === 'user' ? 'You' : 'Agent'}: </strong>
              <span>{msg.content}</span>
            </div>
          ))}
          {isLoading && <div style={{ color: '#888' }}>Agent is typing...</div>}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your answer here..."
            style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={handleSendMessage} style={{ padding: '12px 24px', backgroundColor: '#b5451b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Send
          </button>
        </div>
      </div>

      {/* Right Panel: Live Document Preview */}
      <div style={{ flex: 1, padding: '30px', backgroundColor: '#f5f0e8', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Document Preview</h2>
          {documentContent && (
            <button style={{ padding: '8px 16px', backgroundColor: '#c9a84c', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Download PDF
            </button>
          )}
        </div>

        <div style={{ 
          width: '100%', 
          minHeight: '80%', 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          borderRadius: '4px'
        }}>
          {documentContent ? (
            <ReactMarkdown>{documentContent}</ReactMarkdown>
          ) : (
            <div style={{ color: '#888', textAlign: 'center', marginTop: '100px' }}>
              Your co-created masterpiece will appear here...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;