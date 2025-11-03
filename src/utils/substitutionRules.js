/**
 * Rule-based ingredient substitution mappings
 * These provide quick alternatives when AI is not available or as fallback
 */

export const SUBSTITUTION_RULES = {
  // Dairy substitutions
  butter: [
    { ingredient: 'Olive Oil', ratio: '3/4', note: 'For baking, reduce liquid by 3 tbsp per cup' },
    { ingredient: 'Coconut Oil', ratio: '1:1', note: 'Best for baking and sautéing' },
    { ingredient: 'Applesauce', ratio: '1/2', note: 'For baking, reduces fat content' },
  ],
  'milk': [
    { ingredient: 'Almond Milk', ratio: '1:1', note: 'Unsweetened for savory dishes' },
    { ingredient: 'Oat Milk', ratio: '1:1', note: 'Creamy texture, good for baking' },
    { ingredient: 'Coconut Milk', ratio: '1:1', note: 'Adds slight coconut flavor' },
    { ingredient: 'Soy Milk', ratio: '1:1', note: 'Neutral flavor, high protein' },
  ],
  'heavy cream': [
    { ingredient: 'Coconut Cream', ratio: '1:1', note: 'For dairy-free option' },
    { ingredient: 'Cashew Cream', ratio: '1:1', note: 'Blend cashews with water' },
    { ingredient: 'Half & Half + Butter', ratio: '7/8 cup half & half + 1/8 cup butter', note: 'Closest to heavy cream' },
  ],
  'cream cheese': [
    { ingredient: 'Greek Yogurt', ratio: '1:1', note: 'Lower fat, tangy flavor' },
    { ingredient: 'Coconut Cream', ratio: '1:1', note: 'Dairy-free option' },
    { ingredient: 'Silken Tofu', ratio: '1:1', note: 'Blend until smooth' },
  ],

  // Flour substitutions
  'all-purpose flour': [
    { ingredient: 'Whole Wheat Flour', ratio: '1:1', note: 'Use 3/4 cup whole wheat + 1/4 cup all-purpose for better texture' },
    { ingredient: 'Almond Flour', ratio: '1/4 cup less', note: 'Gluten-free, higher fat' },
    { ingredient: 'Coconut Flour', ratio: '1/4', note: 'Highly absorbent, use with eggs' },
    { ingredient: 'Oat Flour', ratio: '1:1', note: 'Blend rolled oats to make flour' },
  ],
  'wheat flour': [
    { ingredient: 'Rice Flour', ratio: '1:1', note: 'For gluten-free baking' },
    { ingredient: 'Buckwheat Flour', ratio: '1:1', note: 'Nutty flavor, gluten-free' },
    { ingredient: 'Quinoa Flour', ratio: '1:1', note: 'High protein, mild flavor' },
  ],

  // Egg substitutions
  'egg': [
    { ingredient: 'Flax Egg', ratio: '1 tbsp ground flaxseed + 3 tbsp water', note: 'Let sit 5 minutes, equals 1 egg' },
    { ingredient: 'Chia Egg', ratio: '1 tbsp chia seeds + 3 tbsp water', note: 'Similar to flax egg' },
    { ingredient: 'Applesauce', ratio: '1/4 cup', note: 'For binding in baking' },
    { ingredient: 'Mashed Banana', ratio: '1/4 cup', note: 'Adds moisture and sweetness' },
    { ingredient: 'Silken Tofu', ratio: '1/4 cup blended', note: 'Good for dense baked goods' },
  ],

  // Sugar substitutions
  'white sugar': [
    { ingredient: 'Honey', ratio: '3/4 cup honey = 1 cup sugar', note: 'Reduce liquid by 1/4 cup' },
    { ingredient: 'Maple Syrup', ratio: '3/4 cup = 1 cup sugar', note: 'Adds maple flavor' },
    { ingredient: 'Coconut Sugar', ratio: '1:1', note: 'Similar texture and sweetness' },
    { ingredient: 'Stevia', ratio: '1 tsp = 1 cup sugar', note: 'Very concentrated, adjust to taste' },
  ],
  'brown sugar': [
    { ingredient: 'White Sugar + Molasses', ratio: '1 cup white sugar + 1 tbsp molasses', note: 'Mix thoroughly' },
    { ingredient: 'Coconut Sugar', ratio: '1:1', note: 'Natural brown sugar alternative' },
    { ingredient: 'Maple Syrup', ratio: '3/4 cup', note: 'For liquid recipes' },
  ],

  // Meat substitutions
  'ground beef': [
    { ingredient: 'Ground Turkey', ratio: '1:1', note: 'Leaner option, may need extra seasoning' },
    { ingredient: 'Ground Chicken', ratio: '1:1', note: 'Lower fat, similar texture' },
    { ingredient: 'Lentils', ratio: '1 cup cooked = 1 lb ground beef', note: 'Plant-based protein' },
    { ingredient: 'Mushrooms', ratio: '1:1 by weight', note: 'Umami flavor, great for burgers' },
  ],
  'chicken': [
    { ingredient: 'Tofu', ratio: '1:1 by weight', note: 'Marinate for best flavor' },
    { ingredient: 'Tempeh', ratio: '1:1 by weight', note: 'Firm texture, high protein' },
    { ingredient: 'Chickpeas', ratio: '1:1 by weight', note: 'Great in salads and curries' },
  ],

  // Vegetable oil substitutions
  'vegetable oil': [
    { ingredient: 'Olive Oil', ratio: '1:1', note: 'Use extra virgin for salads, regular for cooking' },
    { ingredient: 'Coconut Oil', ratio: '1:1', note: 'Solid at room temp, melt before use' },
    { ingredient: 'Avocado Oil', ratio: '1:1', note: 'High smoke point, neutral flavor' },
    { ingredient: 'Canola Oil', ratio: '1:1', note: 'Neutral flavor, good for baking' },
  ],

  // Leavening agents
  'baking powder': [
    { ingredient: 'Baking Soda + Cream of Tartar', ratio: '1/4 tsp baking soda + 1/2 tsp cream of tartar = 1 tsp baking powder', note: 'Mix before adding' },
    { ingredient: 'Baking Soda + Buttermilk', ratio: '1/4 tsp baking soda = 1 tsp baking powder', note: 'Replace liquid with buttermilk' },
  ],
  'baking soda': [
    { ingredient: 'Baking Powder', ratio: '3x the amount', note: 'Use 3 tsp baking powder = 1 tsp baking soda' },
  ],

  // Vinegar substitutions
  'white vinegar': [
    { ingredient: 'Apple Cider Vinegar', ratio: '1:1', note: 'Milder flavor, slight apple taste' },
    { ingredient: 'Lemon Juice', ratio: '1:1', note: 'Adds citrus flavor' },
    { ingredient: 'Rice Vinegar', ratio: '1:1', note: 'Milder, slightly sweet' },
  ],
  'balsamic vinegar': [
    { ingredient: 'Red Wine Vinegar + Honey', ratio: '1:1 + 1 tsp honey per tbsp', note: 'Mix for similar sweetness' },
    { ingredient: 'Apple Cider Vinegar', ratio: '1:1', note: 'Lighter flavor' },
  ],
};

/**
 * Gets rule-based substitutions for an ingredient
 * @param {string} ingredientName - Name of the ingredient to substitute
 * @returns {Array} Array of substitution options
 */
export const getRuleBasedSubstitutions = (ingredientName) => {
  if (!ingredientName) return [];

  const normalized = ingredientName.toLowerCase().trim();
  
  // Direct match
  if (SUBSTITUTION_RULES[normalized]) {
    return SUBSTITUTION_RULES[normalized];
  }

  // Partial match (e.g., "butter" matches "unsalted butter")
  for (const [key, substitutions] of Object.entries(SUBSTITUTION_RULES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return substitutions;
    }
  }

  return [];
};

/**
 * Checks if AI substitution is recommended for better results
 * @param {string} ingredientName - Name of the ingredient
 * @returns {boolean} - Whether AI substitution would be beneficial
 */
export const shouldUseAISubstitution = (ingredientName) => {
  const normalized = ingredientName.toLowerCase().trim();
  
  // If we have a rule-based substitution, rule-based is fine
  // AI is better for complex or uncommon ingredients
  return !SUBSTITUTION_RULES[normalized] && normalized.length > 0;
};

