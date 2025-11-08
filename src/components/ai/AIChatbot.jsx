import { useState, useRef, useEffect } from 'react';
import { aiChatApi } from '../../api/aiChatApi';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { 
  FaRobot, 
  FaPaperPlane, 
  FaUtensils, 
  FaSpinner, 
  FaClock, 
  FaChartBar,
  FaLightbulb,
  FaPlus,
  FaTimes
} from 'react-icons/fa';

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [mealType, setMealType] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState('recipe'); // 'recipe' or 'general'
  
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage = {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI cooking assistant! 🍳 I can help you find recipes based on ingredients you have, or answer any cooking questions. What would you like to cook today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (chatMode === 'recipe' && ingredients.length > 0) {
        handleRecipeRequest();
      } else if (chatMode === 'general' && inputMessage.trim()) {
        handleGeneralChat();
      }
    }
  };

  const handleIngredientKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleRecipeRequest = async () => {
    if (ingredients.length === 0) {
      toast.warning('Please add some ingredients first!');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: `Find recipes using: ${ingredients.join(', ')}${mealType ? ` for ${mealType}` : ''}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const request = {
        ingredients,
        mealType,
        dietaryRestrictions,
        chatType: 'recipe_suggestion'
      };

      const response = await aiChatApi.getRecipeSuggestions(request);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message,
        recipeSuggestions: response.recipeSuggestions || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      toast.error('Sorry, I had trouble getting recipe suggestions. Please try again!');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting to get recipe suggestions right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneralChat = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await aiChatApi.handleGeneralChat(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in general chat:', error);
      toast.error('Sorry, I had trouble understanding your question. Please try again!');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I didn't quite understand that. Could you try rephrasing your question?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderRecipeSuggestion = (suggestion) => (
    <div 
      key={suggestion.name} 
      className="mt-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg"
    >
      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center">
        <FaUtensils className="mr-2" />
        {suggestion.name}
      </h4>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
        {suggestion.description}
      </p>
      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 space-x-4">
        {suggestion.cookTime && (
          <span className="flex items-center">
            <FaClock className="mr-1" />
            {suggestion.cookTime}
          </span>
        )}
        {suggestion.difficulty && (
          <span className="flex items-center">
            <FaChartBar className="mr-1" />
            {suggestion.difficulty}
          </span>
        )}
      </div>
    </div>
  );

  const renderMessageContent = (content) => {
    // Split content into lines for processing
    const lines = content.split('\n');
    const elements = [];
    let currentSection = [];
    let inList = false;
    let listItems = [];

    lines.forEach((line, index) => {
      // Handle headings (lines starting with ###, ##, #)
      if (line.startsWith('###')) {
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }
        elements.push(
          <h3 key={`h3-${index}`} className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-3 mt-6 flex items-center">
            <FaUtensils className="mr-2" />
            {line.replace(/^###\s*/, '').replace(/🍲|🛒|👩‍🍳|🥗|✨/g, '').trim()}
          </h3>
        );
      } else if (line.startsWith('##')) {
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-4 mt-8 border-b border-orange-200 dark:border-orange-700 pb-2">
            {line.replace(/^##\s*/, '').replace(/🍲|🛒|👩‍🍳|🥗|✨/g, '').trim()}
          </h2>
        );
      } else if (line.startsWith('#')) {
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }
        elements.push(
          <h1 key={`h1-${index}`} className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-4 mt-8">
            {line.replace(/^#\s*/, '').replace(/🍲|🛒|👩‍🍳|🥗|✨/g, '').trim()}
          </h1>
        );
      }
      // Handle emoji-based section headers (🍽️ Yield & Prep Time, etc.)
      else if (/^(🍽️|🛒|👩‍🍳|🥗|✨|🔥|💡|⏱️|🍲)/.test(line)) {
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }
        
        if (inList && listItems.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="mb-4 space-y-2">{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        
        const emojiMatch = line.match(/^(🍽️|🛒|👩‍🍳|🥗|✨|🔥|💡|⏱️|🍲)/);
        const emoji = emojiMatch ? emojiMatch[0] : '';
        const text = line.replace(/^(🍽️|🛒|👩‍🍳|🥗|✨|🔥|💡|⏱️|🍲)\s*/, '').trim();
        
        elements.push(
          <h4 key={`h4-${index}`} className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-3 mt-6 flex items-center bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border-l-4 border-orange-400">
            <span className="mr-2">{emoji}</span>
            <span>{text}</span>
          </h4>
        );
      }
      // Handle list items (lines starting with *, -, →, or •)
      else if (line.trim().startsWith('*') || line.trim().startsWith('-') || line.trim().startsWith('→') || line.trim().startsWith('•') || line.includes('**') && line.includes(':**')) {
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }
        
        if (!inList) {
          inList = true;
          listItems = [];
        }
        
        let listItem = line.replace(/^\s*[*-→•]\s*/, '').trim();
        
        // Choose bullet style based on the original marker
        let bulletIcon = '•';
        if (line.trim().startsWith('→')) {
          bulletIcon = '→';
        }
        
        // Handle bold patterns in list items
        if (listItem.includes('**')) {
          const processedText = listItem.split('**').map((part, i) => 
            i % 2 === 0 ? part : <strong key={`bold-${i}`} className="font-semibold text-orange-700 dark:text-orange-300">{part}</strong>
          );
          
          listItems.push(
            <li key={`li-${index}`} className="mb-3 flex items-start">
              <span className="text-orange-500 mr-3 mt-1.5 text-lg">{bulletIcon}</span>
              <div className="flex-1">{processedText}</div>
            </li>
          );
        } else {
          listItems.push(
            <li key={`li-${index}`} className="mb-3 flex items-start">
              <span className="text-orange-500 mr-3 mt-1.5 text-lg">{bulletIcon}</span>
              <span className="flex-1">{listItem}</span>
            </li>
          );
        }
      }
      // Handle numbered lists
      else if (line.trim().match(/^\d+\./)) {
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }
        
        if (!inList) {
          inList = true;
          listItems = [];
        }
        
        const listItem = line.replace(/^\s*\d+\.\s*/, '').trim();
        const stepNumber = line.match(/^\s*(\d+)\./)[1];
        listItems.push(
          <li key={`li-${index}`} className="mb-3 flex items-start">
            <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
              {stepNumber}
            </span>
            <span>{listItem}</span>
          </li>
        );
      }
      // Handle bold text patterns (**text**)
      else if (line.includes('**')) {
        if (inList && listItems.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="mb-4 space-y-2">{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }

        // Process bold text
        const processedText = line.split('**').map((part, i) => 
          i % 2 === 0 ? part : <strong key={`bold-${i}`} className="font-bold text-orange-600 dark:text-orange-400">{part}</strong>
        );
        
        elements.push(
          <p key={`p-bold-${index}`} className="mb-3 font-medium">
            {processedText}
          </p>
        );
      }
      // Handle emphasis lines (Yields:, Prep time:, etc.)
      else if (line.includes('Yields:') || line.includes('Prep time:') || line.includes('Cook time:')) {
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }
        
        elements.push(
          <div key={`info-${index}`} className="bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-400 p-3 mb-4">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200">{line}</p>
          </div>
        );
      }
      // Handle dividers (lines with ---)
      else if (line.trim() === '---') {
        if (inList && listItems.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="mb-4 space-y-2">{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }
        elements.push(<hr key={`hr-${index}`} className="my-6 border-gray-200 dark:border-gray-700" />);
      }
      // Handle empty lines
      else if (line.trim() === '') {
        if (inList && listItems.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="mb-4 space-y-2">{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        if (currentSection.length > 0) {
          elements.push(<p key={`p-${index}`} className="mb-4">{currentSection.join(' ')}</p>);
          currentSection = [];
        }
      }
      // Regular text lines
      else {
        if (inList && listItems.length > 0 && !line.trim().startsWith('*') && !line.trim().startsWith('-') && !line.trim().match(/^\d+\./)) {
          elements.push(<ul key={`ul-${index}`} className="mb-4 space-y-2">{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        currentSection.push(line);
      }
    });

    // Handle any remaining content
    if (inList && listItems.length > 0) {
      elements.push(<ul key="ul-final" className="mb-4 space-y-1 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border-l-4 border-orange-300">{listItems}</ul>);
    }
    if (currentSection.length > 0) {
      elements.push(<p key="p-final" className="mb-4">{currentSection.join(' ')}</p>);
    }

    return <div className="space-y-2">{elements}</div>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <FaRobot className="text-3xl text-orange-500 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Cooking Assistant
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get recipe suggestions and cooking advice
            </p>
          </div>
        </div>

        {/* Chat Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setChatMode('recipe')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              chatMode === 'recipe'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Recipe Finder
          </button>
          <button
            onClick={() => setChatMode('general')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              chatMode === 'general'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Cooking Q&A
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              {message.type === 'bot' && (
                <div className="flex items-center mb-2">
                  <FaRobot className="text-orange-500 mr-2" />
                  <span className="font-medium text-orange-500">AI Assistant</span>
                </div>
              )}
              
              <div className="max-w-none">
                {renderMessageContent(message.content)}
              </div>
              
              {/* Recipe Suggestions */}
              {message.recipeSuggestions && message.recipeSuggestions.length > 0 && (
                <div className="mt-3">
                  {message.recipeSuggestions.map(renderRecipeSuggestion)}
                </div>
              )}
              
              <div className="text-xs opacity-75 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FaSpinner className="animate-spin mr-2" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        {chatMode === 'recipe' ? (
          // Recipe Mode Input
          <div className="space-y-4">
            {/* Ingredients Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaLightbulb className="inline mr-2" />
                Your Ingredients
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyPress={handleIngredientKeyPress}
                  placeholder="Add an ingredient (e.g., chicken, tomatoes, rice)"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={addIngredient}
                  className="px-4 py-2 bg-orange-500 text-white rounded-r-md hover:bg-orange-600 transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Ingredients List */}
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-2 text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-100"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meal Type (optional)
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Any meal</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRecipeRequest}
              disabled={loading || ingredients.length === 0}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaUtensils className="mr-2" />
              )}
              Find Recipes
            </button>
          </div>
        ) : (
          // General Chat Mode Input
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about cooking..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={handleGeneralChat}
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-3 bg-orange-500 text-white rounded-r-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatbot;