import React from 'react';

import { Row, Col } from '../../components/Grid';
import Flex from '../../components/Flex';
import Box from '../../components/Box';
import RecipeCard from './RecipeCard';
import PriceInfo from './PriceInfo';

import { parseRawPrice } from './price';

import useFetchHelloFreshBox from '../../hooks/useFetchHelloFreshBox';

const Recipes = () => {
  // This state stores the array of recipes with the changes performed by the customer.
  const [recipes, setRecipes] = React.useState([]);
  const [maxRecipesSelected, setMaxRecipesSelected] = React.useState(false);
  const [minRecipesSelected, setMinRecipesSelected] = React.useState(false);
  const [selectionCounter, setSelectionCounter] = React.useState(0);

  const { data, loading } = useFetchHelloFreshBox();

  React.useEffect(() => {
    const { recipes: fetchedRecipes } = data;

    if (fetchedRecipes) {
      const selectedRecipesQuantity = Object.keys(fetchedRecipes).reduce(
        (acc, curr) => acc + fetchedRecipes[curr].selected,
        0
      );

      setRecipes(fetchedRecipes);
      setSelectionCounter(selectedRecipesQuantity);
    }
  }, [setRecipes, data]);

  React.useEffect(() => {
    if (selectionCounter === data.max) {
      setMaxRecipesSelected(true);
    }

    if (selectionCounter >= data.min) {
      setMinRecipesSelected(true);
    }

    return () => {
      setMaxRecipesSelected(false);
      setMinRecipesSelected(false);
    };
  }, [selectionCounter, data.max, data.min]);

  if (loading) {
    return null;
  }

  // add/remove recipe, feel free to remove or rename these these variables and values.
  const handleAddRecipe = (recipeId, selected = 0, selectionLimit = null) => {
    const hasLimitReached = selectionLimit === selected || maxRecipesSelected;

    if (hasLimitReached) {
      return;
    }

    const selectedRecipesIncreased = recipes.map((item, index, recipesArray) => {
      if (item.id === recipeId) {
        return {
          ...recipesArray[index],
          selected: recipesArray[index].selected + 1,
        };
      }

      return item;
    });

    setRecipes(selectedRecipesIncreased);
    setSelectionCounter(selectionCounter + 1);
  };

  const handleRemoveRecipe = (recipeId) => {
    const selectedRecipesDecreased = recipes.map((item, index, recipesArray) => {
      if (item.id === recipeId) {
        return {
          ...recipesArray[index],
          selected: recipesArray[index].selected - 1,
        };
      }

      return item;
    });

    setRecipes(selectedRecipesDecreased);
    setSelectionCounter(selectionCounter - 1);
  };

  // price summary and total price, feel free to remove or rename these variables and values.
  const getTotalExtraCharge = () => {
    const extraChargeRecipes = summary.filter((recipe) => {
      return recipe.extraCharge > 0;
    });

    if (extraChargeRecipes.length === 0) {
      return 0;
    }

    const totalExtraCharge = extraChargeRecipes
      .map((recipe) => {
        return {
          ...recipe,
          extraCharge: Number(recipe.extraCharge) * Number(recipe.selected),
        };
      })
      .reduce((acc, curr) => {
        return acc + curr.extraCharge;
      }, 0);

    return totalExtraCharge;
  };

  const calculateTotalPrice = () => {
    const { baseRecipePrice, shippingPrice } = data;

    const subtotal = baseRecipePrice * selectionCounter;
    const extraCharge = getTotalExtraCharge();

    return subtotal + shippingPrice + extraCharge;
  };

  const getSelectedRecipes = () => {
    return recipes.filter((recipe) => recipe.selected > 0);
  };

  const summary = getSelectedRecipes();
  const priceInfoProps = {
    summary: summary,
    totalPrice: calculateTotalPrice(),
    shippingPrice: data.shippingPrice,
    baseRecipePrice: data.baseRecipePrice,
  };

  return (
    <>
      <Row>
        <Col sm={6}>
          <h3>{data.headline}</h3>
        </Col>
        <Col sm={6}>
          <Flex alignItems="center" justifyContent="flex-end">
            <Box textAlign="right" mr="xs">
              <h3>{parseRawPrice(priceInfoProps.totalPrice)}</h3>
            </Box>
            <PriceInfo priceInfoProps={priceInfoProps} />
          </Flex>
        </Col>
      </Row>

      <Row>
        {recipes.map((recipe) => (
          <Col sm={12} md={6} xl={4} key={recipe.id}>
            <Box mb="md">
              <RecipeCard
                {...recipe}
                handleAddRecipe={handleAddRecipe}
                handleRemoveRecipe={handleRemoveRecipe}
                maxRecipesSelected={maxRecipesSelected}
                minRecipesSelected={minRecipesSelected}
              />
            </Box>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Recipes;
