import { useState } from 'react';
import { recipeApi } from '../../api/recipeApi';
import { getRuleBasedSubstitutions, shouldUseAISubstitution } from '../../utils/substitutionRules';
import { toast } from 'react-toastify';
import { FaExchangeAlt, FaRobot, FaMagic, FaInfoCircle } from 'react-icons/fa';
import Loader from '../common/Loader';

const IngredientSubstitutions = ({ ingredient, onSubstitute }) => {
  const [substitutions, setSubstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [showSubstitutions, setShowSubstitutions] = useState(false);

  const fetchSubstitutions = async (ingredientName, useAISubstitution = false) => {
    if (!ingredientName || !ingredientName.trim()) return;

    setLoading(true);
    setShowSubstitutions(true);
    
    try {
      // First, try rule-based substitutions (instant, no API call)
      const ruleBasedSubs = getRuleBasedSubstitutions(ingredientName);
      
      if (ruleBasedSubs.length > 0 && !useAISubstitution) {
        setSubstitutions(ruleBasedSubs);
        setLoading(false);
        return;
      }

      // If AI is requested or no rule-based substitutions, call API
      if (useAISubstitution || shouldUseAISubstitution(ingredientName)) {
        try {
          const response = await recipeApi.getIngredientSubstitutions(
            ingredientName,
            useAISubstitution
          );
          
          // Backend should return { substitutions: [...] } or array directly
          const subs = response.substitutions || response || [];
          
          // Merge with rule-based if AI didn't return results
          if (subs.length === 0 && ruleBasedSubs.length > 0) {
            setSubstitutions(ruleBasedSubs);
          } else {
            setSubstitutions(subs);
          }
        } catch (error) {
          console.error('AI substitution error:', error);
          // Fallback to rule-based if AI fails
          if (ruleBasedSubs.length > 0) {
            setSubstitutions(ruleBasedSubs);
            toast.info('Using rule-based substitutions (AI unavailable)');
          } else {
            toast.error('No substitutions found for this ingredient');
            setSubstitutions([]);
          }
        }
      } else {
        setSubstitutions(ruleBasedSubs);
      }
    } catch (error) {
      console.error('Error fetching substitutions:', error);
      toast.error('Failed to load substitutions');
      setSubstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubstitute = (substitution) => {
    if (onSubstitute) {
      onSubstitute({
        original: ingredient.ingredientName,
        substitute: substitution.ingredient,
        ratio: substitution.ratio,
        note: substitution.note,
      });
    }
  };

  if (!ingredient) return null;

  const ruleBasedAvailable = getRuleBasedSubstitutions(ingredient.ingredientName).length > 0;
  const aiRecommended = shouldUseAISubstitution(ingredient.ingredientName);

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (!showSubstitutions) {
            fetchSubstitutions(ingredient.ingredientName, useAI);
          } else {
            setShowSubstitutions(false);
          }
        }}
        className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors"
        title="Find ingredient substitutions"
      >
        <FaExchangeAlt className="mr-1" />
        {showSubstitutions ? 'Hide' : 'Find'} Substitutions
      </button>

      {/* AI Toggle (if both rule-based and AI are available) */}
      {ruleBasedAvailable && aiRecommended && (
        <button
          onClick={() => setUseAI(!useAI)}
          className="ml-2 flex items-center text-sm text-gray-600 hover:text-gray-800"
        >
          <FaRobot className={`mr-1 ${useAI ? 'text-blue-500' : ''}`} />
          {useAI ? 'Using AI' : 'Use AI'}
        </button>
      )}

      {showSubstitutions && (
        <div className="absolute z-10 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">
              Substitutions for {ingredient.ingredientName}
            </h4>
            <button
              onClick={() => setShowSubstitutions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="py-4">
              <Loader />
              {useAI && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  <FaMagic className="inline mr-1" />
                  Getting AI suggestions...
                </p>
              )}
            </div>
          ) : substitutions.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {substitutions.map((sub, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-3 hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">
                        {sub.ingredient || sub.substitute || sub.name}
                      </h5>
                      {sub.ratio && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Ratio:</span> {sub.ratio}
                        </p>
                      )}
                      {sub.note && (
                        <p className="text-xs text-gray-500 mt-1 flex items-start">
                          <FaInfoCircle className="mr-1 mt-0.5 flex-shrink-0" />
                          {sub.note || sub.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleSubstitute(sub)}
                      className="ml-2 px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
                    >
                      Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No substitutions found for this ingredient.
              {aiRecommended && (
                <button
                  onClick={() => {
                    setUseAI(true);
                    fetchSubstitutions(ingredient.ingredientName, true);
                  }}
                  className="block mt-2 text-orange-500 hover:text-orange-600"
                >
                  Try AI suggestions
                </button>
              )}
            </div>
          )}

          {ruleBasedAvailable && !loading && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 flex items-center">
                <FaInfoCircle className="mr-1" />
                {useAI ? 'AI-enhanced' : 'Rule-based'} substitutions
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientSubstitutions;

