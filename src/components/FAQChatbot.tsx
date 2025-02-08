import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Languages } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

const FAQ_RESPONSES = {
  en: {
    default: "I'm sorry, I don't understand that question. Please try asking something about emergencies, shelters, medical services, or using the map.",
    map: "The map shows all disaster response centers. Red icons are health centers, and yellow icons are shelters. Click on any marker to see details. You can also search for centers using the search bar at the top.",
    emergency: "In case of emergency: 1. Stay calm 2. Call emergency services 3. Follow evacuation instructions if given 4. Use our map to find the nearest shelter or health center 5. Keep emergency contacts handy",
    shelter: "To find the nearest shelter: 1. Allow location access in the app 2. Look for yellow triangle markers on the map 3. Click markers to see capacity and contact info 4. Use the search bar to filter by location",
    supplies: "Essential emergency supplies: 1. Water (3-day supply) 2. Non-perishable food 3. First aid kit 4. Flashlight and batteries 5. Important documents 6. Basic medications 7. Mobile phone and charger 8. Battery-powered radio",
    medical: "Medical services available: 1. Emergency first aid 2. Basic health checkups 3. Medicine distribution 4. Ambulance services. Red heart icons on the map show medical centers. Click them for contact details.",
    weather: "Weather warnings are color-coded: Red = Severe risk (take immediate action), Yellow = Moderate risk (stay alert), Blue = Minor risk (monitor conditions). The app shows current conditions and forecasts.",
    about: "This is a disaster response platform that helps you: 1. Find nearby shelters and medical centers 2. Get real-time weather warnings 3. Access emergency information 4. Find contact details for help 5. Track facility capacity",
  },
  hi: {
    default: "क्षमा करें, मैं यह प्रश्न नहीं समझ पा रहा/रही हूं। कृपया आपातकाल, आश्रय, चिकित्सा सेवाओं, या नक्शे के उपयोग के बारे में पूछें।",
    map: "नक्शे पर सभी आपदा प्रतिक्रिया केंद्र दिखाए गए हैं। लाल चिह्न स्वास्थ्य केंद्र हैं, और पीले चिह्न आश्रय हैं। विवरण देखने के लिए किसी भी चिह्न पर क्लिक करें। आप ऊपर की खोज पट्टी का उपयोग करके केंद्रों को खोज भी सकते हैं।",
    emergency: "आपातकाल में: 1. शांत रहें 2. आपातकालीन सेवाओं को कॉल करें 3. निकासी निर्देशों का पालन करें 4. निकटतम आश्रय या स्वास्थ्य केंद्र खोजने के लिए हमारा नक्शा उपयोग करें 5. आपातकालीन संपर्क तैयार रखें",
    shelter: "निकटतम आश्रय खोजने के लिए: 1. ऐप में लोकेशन एक्सेस की अनुमति दें 2. नक्शे पर पीले त्रिकोण चिह्न देखें 3. क्षमता और संपर्क जानकारी देखने के लिए चिह्नों पर क्लिक करें 4. स्थान के अनुसार फ़िल्टर करने के लिए खोज बार का उपयोग करें",
    supplies: "आवश्यक आपातकालीन सामग्री: 1. पानी (3 दिन की आपूर्ति) 2. लंबे समय तक चलने वाला भोजन 3. प्राथमिक चिकित्सा किट 4. टॉर्च और बैटरी 5. महत्वपूर्ण दस्तावेज 6. बुनियादी दवाएं 7. मोबाइल फोन और चार्जर 8. बैटरी से चलने वाला रेडियो",
    medical: "उपलब्ध चिकित्सा सेवाएं: 1. आपातकालीन प्राथमिक चिकित्सा 2. बुनियादी स्वास्थ्य जांच 3. दवा वितरण 4. एम्बुलेंस सेवाएं। नक्शे पर लाल दिल के चिह्न चिकित्सा केंद्र दिखाते हैं। संपर्क विवरण के लिए उन पर क्लिक करें।",
    weather: "मौसम चेतावनियां रंग-कोडित हैं: लाल = गंभीर जोखिम (तुरंत कार्रवाई करें), पीला = मध्यम जोखिम (सतर्क रहें), नीला = मामूली जोखिम (स्थितियों पर नज़र रखें)। ऐप वर्तमान स्थितियां और पूर्वानुमान दिखाता है।",
    about: "यह एक आपदा प्रतिक्रिया प्लेटफॉर्म है जो आपकी मदद करता है: 1. आस-पास के आश्रय और चिकित्सा केंद्र खोजने में 2. रीयल-टाइम मौसम चेतावनियां प्राप्त करने में 3. आपातकालीन जानकारी तक पहुंचने में 4. मदद के लिए संपर्क विवरण खोजने में 5. सुविधा क्षमता की जानकारी पाने में",
  }
};

export function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');

    // Find response based on keywords
    let response = FAQ_RESPONSES[language].default;
    const lowercaseInput = userMessage.toLowerCase();

    if (lowercaseInput.includes('map') || lowercaseInput.includes('नक्शा')) {
      response = FAQ_RESPONSES[language].map;
    } else if (lowercaseInput.includes('emergency') || lowercaseInput.includes('आपातकाल')) {
      response = FAQ_RESPONSES[language].emergency;
    } else if (lowercaseInput.includes('shelter') || lowercaseInput.includes('आश्रय')) {
      response = FAQ_RESPONSES[language].shelter;
    } else if (lowercaseInput.includes('supplies') || lowercaseInput.includes('सामग्री')) {
      response = FAQ_RESPONSES[language].supplies;
    } else if (lowercaseInput.includes('medical') || lowercaseInput.includes('चिकित्सा')) {
      response = FAQ_RESPONSES[language].medical;
    } else if (lowercaseInput.includes('weather') || lowercaseInput.includes('मौसम')) {
      response = FAQ_RESPONSES[language].weather;
    } else if (lowercaseInput.includes('about') || lowercaseInput.includes('बारे में')) {
      response = FAQ_RESPONSES[language].about;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Open FAQ chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col border dark:border-gray-700 transition-colors duration-200">
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">FAQ Assistant</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle language"
          >
            <Languages className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            {language === 'en' 
              ? "Hello! I'm here to help you with information about our disaster response platform. Ask me anything about emergencies, shelters, or how to use the map."
              : "नमस्ते! मैं आपको हमारे आपदा प्रतिक्रिया प्लेटफॉर्म के बारे में जानकारी देने में मदद करूंगा/करूंगी। आप मुझसे आपातकाल, आश्रय, या नक्शे के उपयोग के बारे में कुछ भी पूछ सकते हैं।"}
          </p>
        </div>

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'en' ? "Type your question..." : "अपना प्रश्न टाइप करें..."}
            className="flex-1 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Options */}
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Quick Options:' : 'त्वरित विकल्प:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {language === 'en' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setInput("What should I do in case of an emergency?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  Emergency Steps
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("How can I find the nearest shelter?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  Find Shelter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("What supplies should I keep ready?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  Emergency Supplies
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("How do I use the map?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  Map Guide
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("What medical services are available?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  Medical Services
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("What do the weather warnings mean?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  Weather Warnings
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setInput("आपातकाल में क्या करना चाहिए?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  आपातकालीन कदम
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("निकटतम आश्रय कैसे खोजें?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  आश्रय खोजें
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("कौन सी आपूर्ति तैयार रखनी चाहिए?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  आपातकालीन सामग्री
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("नक्शे का उपयोग कैसे करें?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  नक्शा गाइड
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("कौन सी चिकित्सा सेवाएं उपलब्ध हैं?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  चिकित्सा सेवाएं
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput("मौसम की चेतावनियों का क्या मतलब है?");
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  मौसम चेतावनियां
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}