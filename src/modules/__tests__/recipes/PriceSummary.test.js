import React from 'react';
import { render, screen } from '@testing-library/react';

import PriceSummary from '../../recipes/PriceSummary';

const priceInfoProps = {
  summary: [
    {
      id: '5f4d4aa9f4508b34e9680613',
      name: 'Gouda Vibes Burgers',
      slug: 'gouda-vibes-burgers',
      headline: 'with Tomato Onion Jam & Potato Wedges',
      image:
        'https://img.hellofresh.com/c_fill,f_auto,fl_lossy,h_405,q_auto,w_720/hellofresh_s3/image/gouda-vibes-burgers-e3f56d7e.jpg',
      selected: 2,
      selectionLimit: null,
      extraCharge: 0,
      yields: 2,
    },
  ],
  totalPrice: 2550,
  shippingPrice: 1275,
  baseRecipePrice: 1275,
};

describe('PriceSummary', () => {
  it('should render recipe description and quantity of recipes selected', () => {
    render(<PriceSummary priceInfoProps={priceInfoProps} />);
    const recipeName = screen.getByTestId('summary-gouda-vibes-burgers-x-2').firstChild.textContent;
    const expectedName = 'Gouda Vibes Burgers x 2';

    expect(recipeName).toContain(expectedName);
  });

  it('should render formatted total price', () => {
    render(<PriceSummary priceInfoProps={priceInfoProps} />);

    const totalValue = screen.getByTestId('summary-total').lastChild.textContent;
    const expected = '$25.50';

    expect(totalValue).toBe(expected);
  });

  it('should render formatted shipping price', () => {
    render(<PriceSummary priceInfoProps={priceInfoProps} />);

    const totalValue = screen.getByTestId('summary-shipping').lastChild.textContent;
    const expected = '$12.75';

    expect(totalValue).toBe(expected);
  });
});
