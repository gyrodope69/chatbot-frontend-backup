// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './ChatWidget.css';

// const BOOKING_URL = 'https://calendar.app.google/puCsRwJF4Lkw3kjm6';

// const ChatWidget = () => {
//   const [messages, setMessages] = useState([
//     {
//       from: 'bot',
//       text: "Hello! Welcome to Burkan Engineering! 🔥\n\nHow can I help you today?",
//       buttons: [
//         { id: "vr_training", text: "VR Fire Safety Training" },
//         { id: "ai_dashboard", text: "AI Powered Audit Dashboard" },
//         { id: "consulting", text: "Fire Consulting Services" }
//       ]
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [sessionId] = useState(() => `session_${Date.now()}`);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(false);
//   const [showCustomForm, setShowCustomForm] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
//   const [customFormData, setCustomFormData] = useState({ name: '', email: '', phone: '', message: '' });

//   const chatWindowRef = useRef(null);
//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

//   useEffect(() => {
//     if (chatWindowRef.current) {
//       chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = input.trim();
//     setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post(`${API_URL}/api/chat`, {
//         message: userMessage,
//         session_id: sessionId
//       });

//       setMessages(prev => [...prev, {
//         from: 'bot',
//         text: response.data.response,
//         buttons: response.data.buttons || [],
//         intent: response.data.intent
//       }]);

//       if (response.data.needs_form) {
//         setShowRegistrationForm(true);
//       }

//       if (response.data.needs_custom_form) {
//         setShowCustomForm(true);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, {
//         from: 'bot',
//         text: 'Sorry, I encountered an error. Please try again.'
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleButtonClick = async (buttonId, buttonText) => {
//     setMessages(prev => [...prev, { from: 'user', text: buttonText }]);
//     setIsLoading(true);

//     try {
//       const response = await axios.post(`${API_URL}/api/chat`, {
//         message: buttonText,
//         button_id: buttonId,
//         session_id: sessionId
//       });

//       setMessages(prev => [...prev, {
//         from: 'bot',
//         text: response.data.response,
//         buttons: response.data.buttons || []
//       }]);

//       if (response.data.needs_form) {
//         setShowRegistrationForm(true);
//       }

//       if (response.data.needs_custom_form) {
//         setShowCustomForm(true);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(`${API_URL}/api/register`, {
//         ...formData,
//         service_type: "Demo Request",
//         session_id: sessionId
//       });

//       setShowRegistrationForm(false);
//       setMessages(prev => [...prev, {
//         from: 'bot',
//         text: response.data.message || `Thank you, ${formData.name}! Our team will contact you at ${formData.email} within 24 hours.`
//       }]);

//       setFormData({ name: '', email: '', phone: '' });
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setMessages(prev => [...prev, {
//         from: 'bot',
//         text: 'Sorry, there was an error submitting your details. Please try again.'
//       }]);
//     }
//   };

//   const handleCustomFormSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(`${API_URL}/api/register`, {
//         ...customFormData,
//         service_type: "Custom Requirement",
//         session_id: sessionId
//       });

//       setShowCustomForm(false);
//       setMessages(prev => [...prev, {
//         from: 'bot',
//         text: response.data.message || `Thank you, ${customFormData.name}! Our team will review your requirements and contact you soon.`
//       }]);

//       setCustomFormData({ name: '', email: '', phone: '', message: '' });
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, {
//         from: 'bot',
//         text: 'Sorry, there was an error submitting your requirements. Please try again.'
//       }]);
//     }
//   };

//   const FormattedMessage = ({ text }) => {
//     if (!text) return null;

//     const blocks = text.split('\n\n');

//     return (
//       <div className="message-text">
//         {blocks.map((block, blockIndex) => {
//           const lines = block.split('\n').filter(line => line.trim());

//           return (
//             <div key={blockIndex} className="text-block">
//               {lines.map((line, lineIndex) => {
//                 const trimmedLine = line.trim();
//                 const cleanLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

//                 if (cleanLine.startsWith('✓') || cleanLine.startsWith('•') || cleanLine.startsWith('-')) {
//                   return (
//                     <div key={lineIndex} className="text-bullet">
//                       <span className="bullet-icon">✓</span>
//                       <span>{cleanLine.substring(1).trim()}</span>
//                     </div>
//                   );
//                 }

//                 if (/[🔥:]$/.test(cleanLine) || cleanLine.includes('Option') || cleanLine.includes('Package')) {
//                   return <div key={lineIndex} className="text-bold">{cleanLine}</div>;
//                 }

//                 return <div key={lineIndex} className="text-line">{cleanLine}</div>;
//               })}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Helper: is this option a Book Demo or Schedule Demo?
//   const isBookDemoButton = (btn) =>
//     btn.id === 'book_demo' || /book a demo|schedule demo/i.test(btn.text || '');

//   return (
//     <div className="chatbot-container">
//       <button
//         className="chat-toggle-btn"
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle chat"
//       >
//         {isOpen ? '✕' : '💬'}
//       </button>

//       {isOpen && (
//         <div className="chat-widget">
//           <div className="chat-header">
//             <div className="header-content">
//               <div className="company-avatar">🔥</div>
//               <div>
//                 <h3>Burkan Engineering</h3>
//                 <span className="status-indicator">
//                   <span className="status-dot"></span>
//                   Online - We reply instantly
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="chat-window" ref={chatWindowRef}>
//             {messages.map((msg, index) => (
//               <div key={index} className={`message ${msg.from}`}>
//                 {msg.from === 'bot' && <div className="message-avatar">🔥</div>}

//                 <div className="message-wrapper">
//                   <div className="message-bubble">
//                     {msg.from === 'bot' ? (
//                       <FormattedMessage text={msg.text} />
//                     ) : (
//                       <div className="message-text">{msg.text}</div>
//                     )}
//                   </div>

//                   {msg.buttons && msg.buttons.length > 0 && (
//                     <div className="button-group">
//                       {msg.buttons.map((btn, i) => (
//                         <React.Fragment key={i}>
//                           <button
//                             className="option-btn"
//                             onClick={() => handleButtonClick(btn.id, btn.text)}
//                           >
//                             {btn.text}
//                           </button>
//                           {isBookDemoButton(btn) && (
//                             <a
//                               href={BOOKING_URL}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="option-btn appointment-inline-btn"
//                             >
//                               Book an Appointment
//                             </a>
//                           )}
//                         </React.Fragment>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {isLoading && (
//               <div className="message bot">
//                 <div className="message-avatar">🔥</div>
//                 <div className="message-wrapper">
//                   <div className="message-bubble typing">
//                     <span></span><span></span><span></span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {showRegistrationForm && (
//               <div className="message bot">
//                 <div className="message-avatar">🔥</div>
//                 <div className="message-wrapper">
//                   <div className="registration-card">
//                     <h4>
//                       <span>📋</span>
//                       Share Your Details
//                     </h4>
//                     <form onSubmit={handleFormSubmit}>
//                       <input
//                         type="text"
//                         placeholder="Your Full Name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         required
//                         className="form-field"
//                       />
//                       <input
//                         type="email"
//                         placeholder="Email Address"
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         required
//                         className="form-field"
//                       />
//                       <input
//                         type="tel"
//                         placeholder="Phone Number"
//                         value={formData.phone}
//                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                         required
//                         className="form-field"
//                       />
//                       <button type="submit" className="form-submit">
//                         Submit Request ✓
//                       </button>
//                       <button
//                         type="button"
//                         className="form-close"
//                         onClick={() => setShowRegistrationForm(false)}
//                       >
//                         Maybe Later
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {showCustomForm && (
//               <div className="message bot">
//                 <div className="message-avatar">🔥</div>
//                 <div className="message-wrapper">
//                   <div className="registration-card">
//                     <h4>
//                       <span>📝</span>
//                       Share Your Requirement
//                     </h4>
//                     <form onSubmit={handleCustomFormSubmit}>
//                       <input
//                         type="text"
//                         placeholder="Your Full Name"
//                         value={customFormData.name}
//                         onChange={(e) => setCustomFormData({ ...customFormData, name: e.target.value })}
//                         required
//                         className="form-field"
//                       />
//                       <input
//                         type="email"
//                         placeholder="Email Address"
//                         value={customFormData.email}
//                         onChange={(e) => setCustomFormData({ ...customFormData, email: e.target.value })}
//                         required
//                         className="form-field"
//                       />
//                       <input
//                         type="tel"
//                         placeholder="Phone Number"
//                         value={customFormData.phone}
//                         onChange={(e) => setCustomFormData({ ...customFormData, phone: e.target.value })}
//                         required
//                         className="form-field"
//                       />
//                       <textarea
//                         placeholder="Describe your specific requirements..."
//                         value={customFormData.message}
//                         onChange={(e) => setCustomFormData({ ...customFormData, message: e.target.value })}
//                         required
//                         className="form-field"
//                         rows="4"
//                       ></textarea>
//                       <button type="submit" className="form-submit">
//                         Submit Requirement ✓
//                       </button>
//                       <button
//                         type="button"
//                         className="form-close"
//                         onClick={() => setShowCustomForm(false)}
//                       >
//                         Cancel
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="chat-input-area">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Type your message..."
//               className="chat-input"
//               disabled={isLoading}
//             />
//             <button
//               onClick={sendMessage}
//               className="send-btn"
//               disabled={isLoading || !input.trim()}
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <line x1="22" y1="2" x2="11" y2="13"></line>
//                 <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWidget;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatWidget.css';

const BOOKING_URL = 'https://calendar.app.google/HvzkjuzytsGT4Dxz5';

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hello! Welcome to Burkan Engineering! 🔥\n\nHow can I help you today?",
      buttons: [
        { id: "vr_training", text: "VR Fire Safety Training" },
        { id: "ai_dashboard", text: "AI Powered Audit Dashboard" },
        { id: "consulting", text: "Fire Consulting Services" }
      ],
      intent: 'greeting'
    }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [customFormData, setCustomFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const chatWindowRef = useRef(null);
  const API_URL = "https://backend-0ftm.onrender.com";

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage,
        session_id: sessionId
      });

      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: response.data.response,
          buttons: response.data.buttons || [],
          intent: response.data.intent
        }
      ]);

      if (response.data.needs_form) {
        setShowRegistrationForm(true);
      }

      if (response.data.needs_custom_form) {
        setShowCustomForm(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = async (buttonId, buttonText) => {
    setMessages(prev => [...prev, { from: 'user', text: buttonText }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: buttonText,
        button_id: buttonId,
        session_id: sessionId
      });

      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: response.data.response,
          buttons: response.data.buttons || [],
          intent: response.data.intent
        }
      ]);

      if (response.data.needs_form) {
        setShowRegistrationForm(true);
      }

      if (response.data.needs_custom_form) {
        setShowCustomForm(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        ...formData,
        service_type: "Demo Request",
        session_id: sessionId
      });

      setShowRegistrationForm(false);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text:
            response.data.message ||
            `Thank you, ${formData.name}! Our team will contact you at ${formData.email} within 24 hours.`
        }
      ]);

      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: 'Sorry, there was an error submitting your details. Please try again.'
        }
      ]);
    }
  };

  const handleCustomFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        ...customFormData,
        service_type: "Custom Requirement",
        session_id: sessionId
      });

      setShowCustomForm(false);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text:
            response.data.message ||
            `Thank you, ${customFormData.name}! Our team will review your requirements and contact you soon.`
        }
      ]);

      setCustomFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: 'Sorry, there was an error submitting your requirements. Please try again.'
        }
      ]);
    }
  };

  const FormattedMessage = ({ text }) => {
    if (!text) return null;

    const blocks = text.split('\n\n');

    return (
      <div className="message-text">
        {blocks.map((block, blockIndex) => {
          const lines = block.split('\n').filter(line => line.trim());

          return (
            <div key={blockIndex} className="text-block">
              {lines.map((line, lineIndex) => {
                const trimmedLine = line.trim();
                const cleanLine = trimmedLine
                  .replace(/\*\*(.*?)\*\*/g, '$1')
                  .replace(/\*(.*?)\*/g, '$1');

                if (
                  cleanLine.startsWith('✓') ||
                  cleanLine.startsWith('•') ||
                  cleanLine.startsWith('-')
                ) {
                  return (
                    <div key={lineIndex} className="text-bullet">
                      <span className="bullet-icon">✓</span>
                      <span>{cleanLine.substring(1).trim()}</span>
                    </div>
                  );
                }

                if (
                  /[🔥:]$/.test(cleanLine) ||
                  cleanLine.includes('Option') ||
                  cleanLine.includes('Package')
                ) {
                  return (
                    <div key={lineIndex} className="text-bold">
                      {cleanLine}
                    </div>
                  );
                }

                return (
                  <div key={lineIndex} className="text-line">
                    {cleanLine}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isGreetingMessage = (msg) =>
    msg.intent === 'greeting' ||
    (msg.text || '').includes('Welcome to Burkan Engineering');

  const isOptionsMessage = (msg) =>
    (msg.text || '').includes('VR Fire Safety Training Options') ||
    (msg.text || '').includes('AI Powered Audit Dashboard Packages');

  const isAppointmentButton = (btn) =>
    (btn.text || '').toLowerCase().includes('book an appointment');

  return (
    <div className="chatbot-container">
      <button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div className="header-content">
              <div className="company-avatar">🔥</div>
              <div>
                <h3>Burkan Engineering</h3>
                <span className="status-indicator">
                  <span className="status-dot"></span>
                  Online - We reply instantly
                </span>
              </div>
            </div>
          </div>

          <div className="chat-window" ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.from}`}>
                {msg.from === 'bot' && (
                  <div className="message-avatar">🔥</div>
                )}

                <div className="message-wrapper">
                  <div className="message-bubble">
                    {msg.from === 'bot' ? (
                      <FormattedMessage text={msg.text} />
                    ) : (
                      <div className="message-text">{msg.text}</div>
                    )}
                  </div>

                  {msg.buttons && msg.buttons.length > 0 && (
                    <div className="button-group">
                      {isGreetingMessage(msg) || isOptionsMessage(msg)
                        ? (
                          msg.buttons.map((btn, i) => (
                            <button
                              key={i}
                              className="option-btn"
                              onClick={() =>
                                handleButtonClick(btn.id, btn.text)
                              }
                            >
                              {btn.text}
                            </button>
                          ))
                        )
                        : (
                          msg.buttons
                            .filter(isAppointmentButton)
                            .map((btn, i) => (
                              <a
                                key={i}
                                href={BOOKING_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="option-btn appointment-inline-btn"
                              >
                                {btn.text || 'Book an Appointment'}
                              </a>
                            ))
                        )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message bot">
                <div className="message-avatar">🔥</div>
                <div className="message-wrapper">
                  <div className="message-bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {/* forms kept as in your version */}
            {showRegistrationForm && (
              <div className="message bot">
                <div className="message-avatar">🔥</div>
                <div className="message-wrapper">
                  <div className="registration-card">
                    <h4>
                      <span>📋</span>
                      Share Your Details
                    </h4>
                    <form onSubmit={handleFormSubmit}>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="form-field"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="form-field"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        className="form-field"
                      />
                      <button type="submit" className="form-submit">
                        Submit Request ✓
                      </button>
                      <button
                        type="button"
                        className="form-close"
                        onClick={() => setShowRegistrationForm(false)}
                      >
                        Maybe Later
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {showCustomForm && (
              <div className="message bot">
                <div className="message-avatar">🔥</div>
                <div className="message-wrapper">
                  <div className="registration-card">
                    <h4>
                      <span>📝</span>
                      Share Your Requirement
                    </h4>
                    <form onSubmit={handleCustomFormSubmit}>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={customFormData.name}
                        onChange={(e) =>
                          setCustomFormData({
                            ...customFormData,
                            name: e.target.value
                          })
                        }
                        required
                        className="form-field"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={customFormData.email}
                        onChange={(e) =>
                          setCustomFormData({
                            ...customFormData,
                            email: e.target.value
                          })
                        }
                        required
                        className="form-field"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={customFormData.phone}
                        onChange={(e) =>
                          setCustomFormData({
                            ...customFormData,
                            phone: e.target.value
                          })
                        }
                        required
                        className="form-field"
                      />
                      <textarea
                        placeholder="Describe your specific requirements..."
                        value={customFormData.message}
                        onChange={(e) =>
                          setCustomFormData({
                            ...customFormData,
                            message: e.target.value
                          })
                        }
                        required
                        className="form-field"
                        rows="4"
                      ></textarea>
                      <button type="submit" className="form-submit">
                        Submit Requirement ✓
                      </button>
                      <button
                        type="button"
                        className="form-close"
                        onClick={() => setShowCustomForm(false)}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              className="send-btn"
              disabled={isLoading || !input.trim()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
