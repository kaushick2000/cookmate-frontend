# AI-Powered Features Documentation

This directory contains AI-powered features for the Cook Mate application.

## Features

### 1. Recipe Recommendations

The `RecipeRecommendations` component provides personalized recipe suggestions based on:
- **Personalized**: General personalized recommendations (default)
- **History**: Based on user's viewing/cooking history
- **Preferences**: Based on user's dietary preferences and favorite cuisines
- **Trending**: Currently popular recipes

#### Backend API Endpoints Required

```
GET /api/recipes/recommendations
  Query params:
    - type: 'personalized' | 'history' | 'preferences' | 'trending'
    - limit: number (default: 10)

GET /api/recipes/recommendations/history
  Query params:
    - limit: number (default: 10)

GET /api/recipes/recommendations/preferences
  Query params:
    - cuisineType?: string
    - mealType?: string
    - dietaryRestrictions?: string[]
    - limit: number (default: 10)

GET /api/recipes/recommendations/trending
  Query params:
    - limit: number (default: 10)
```

**Response Format:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Recipe Title",
      "description": "Recipe description",
      "imageUrl": "/images/recipe.jpg",
      "averageRating": 4.5,
      "totalReviews": 10,
      ...
    }
  ]
}
```

### 2. Ingredient Substitutions

The `IngredientSubstitutions` component provides ingredient substitution suggestions with:
- **Rule-based substitutions**: Instant, predefined substitutions from `substitutionRules.js`
- **AI-powered substitutions**: Optional LLM-based suggestions for complex or uncommon ingredients

#### Backend API Endpoint Required

```
GET /api/recipes/substitutions
  Query params:
    - ingredient: string (ingredient name)
    - useAI: boolean (optional, default: false)

  Response:
    {
      "substitutions": [
        {
          "ingredient": "Olive Oil",
          "ratio": "3/4",
          "note": "For baking, reduce liquid by 3 tbsp per cup"
        }
      ]
    }
```

#### Rule-Based Substitutions

The frontend includes a comprehensive rule-based substitution system in `substitutionRules.js` covering:
- Dairy products (butter, milk, cream, cheese)
- Flour types
- Eggs
- Sugar types
- Meat alternatives
- Oils
- Leavening agents
- Vinegars

The system automatically:
1. First checks for rule-based substitutions (instant, no API call)
2. Falls back to AI if no rule-based match or if explicitly requested
3. Merges results if both are available

## Usage Examples

### Recipe Recommendations

```jsx
import RecipeRecommendations from '../components/ai/RecipeRecommendations';

<RecipeRecommendations 
  recipeId={currentRecipeId} 
  type="personalized" 
/>
```

### Ingredient Substitutions

```jsx
import IngredientSubstitutions from '../components/ai/IngredientSubstitutions';

<IngredientSubstitutions 
  ingredient={ingredientObject}
  onSubstitute={(substitution) => {
    // Handle substitution selection
    console.log(substitution);
  }}
/>
```

## Backend Implementation Notes

### Recommendations Algorithm (Suggested)

1. **Personalized**: 
   - Analyze user's favorites, viewed recipes, and ratings
   - Use collaborative filtering or content-based filtering
   - Consider cuisine preferences, dietary restrictions

2. **History-based**:
   - Track user's recipe views, saves, and cooking history
   - Find similar recipes based on ingredients or cuisine

3. **Preferences-based**:
   - Filter by user's dietary preferences (vegetarian, vegan, etc.)
   - Match preferred cuisines and meal types
   - Consider nutritional preferences

4. **Trending**:
   - Calculate popularity score based on:
     - Recent views
     - Favorites count
     - Ratings and reviews
     - Recipe age (favor newer recipes)

### AI Substitutions (Optional LLM Integration)

If implementing AI-powered substitutions:
- Use LLM API (OpenAI, Anthropic, etc.) for intelligent substitutions
- Prompt example:
  ```
  "Suggest substitutions for [ingredient] in [context]. 
  Provide alternatives with ratios and notes about flavor/texture changes."
  ```
- Cache common substitutions to reduce API calls
- Fallback to rule-based if AI is unavailable

## Environment Setup

For AI features, you may want to add:

```env
VITE_AI_ENABLED=true
VITE_AI_API_KEY=your_api_key (if using external AI service)
```

## Future Enhancements

- User preference learning system
- Ingredient substitution history tracking
- Recipe recommendation explanations ("Because you liked X, Y, Z...")
- Dietary restriction-aware substitutions
- Recipe difficulty adjustments based on available substitutions

