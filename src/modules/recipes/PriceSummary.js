import React from 'react';
import Box from '../../components/Box';
import Text from '../../components/Text';
import Flex from '../../components/Flex';

import { parseRawPrice } from './price';

const PriceSummaryItem = ({ title, price }) => {
  const isTotal = title.toLowerCase() === 'total';
  const dataTestId = title.replace(/\W/g, '-').toLowerCase();
  const fontWeight = isTotal ? 'bold' : '';

  return (
    <Flex
      backgroundColor="white"
      flexDirection="row"
      justifyContent="space-between"
      paddingBottom="8px"
      data-testid={`summary-${dataTestId}`}>
      <Text fontSize="md" fontWeight={fontWeight}>
        {title}
      </Text>
      <Text fontSize="md" fontWeight={fontWeight}>
        {parseRawPrice(price)}
      </Text>
    </Flex>
  );
};

const renderSummaryItems = ({ summary, baseRecipePrice }) => {
  const summaryComponentItems = summary.map((recipe) => {
    const { id, name, extraCharge, selected } = recipe;
    const hasSelectedMoreThanOnce = selected > 1;
    const recipeDescription = name + (hasSelectedMoreThanOnce ? ` x ${selected}` : '');
    const recipePrice =
      extraCharge === 0 ? baseRecipePrice * selected : baseRecipePrice * selected + extraCharge;

    return <PriceSummaryItem key={id} title={recipeDescription} price={recipePrice} />;
  });

  return summaryComponentItems;
};

// Create PriceSummary user interface
const PriceSummary = ({ priceInfoProps }) => (
  <Box data-testid="price-summary" width={['290px', '450px']} padding="16px">
    {renderSummaryItems(priceInfoProps)}
    <PriceSummaryItem title="Shipping" price={priceInfoProps.shippingPrice} />
    <hr />
    <PriceSummaryItem title="Total" price={priceInfoProps.totalPrice} />
  </Box>
);

export default PriceSummary;
