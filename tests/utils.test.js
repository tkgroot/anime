describe('Utils', () => {
  test('get Object properties', () => {
    const plainValue = anime.get(testObject, 'plainValue');
    const valueWithUnit = anime.get(testObject, 'valueWithUnit');
    const multiplePLainValues = anime.get(testObject, 'multiplePLainValues');
    const multipleValuesWithUnits = anime.get(testObject, 'multipleValuesWithUnits');

    expect(plainValue).toBe(10);
    expect(valueWithUnit).toBe('10px');
    expect(multiplePLainValues).toBe('16 32 64 128');
    expect(multipleValuesWithUnits).toBe('16px 32em 64% 128ch');
  });

  test('get DOM attributes', () => {
    const withWithAttributeWidth = anime.get('.with-width-attribute', 'width');
    const withWithAttributeIndex = anime.get('.with-width-attribute', 'data-index');
    const inputNumberMin = anime.get('#input-number', 'min');
    const inputNumberMax = anime.get('#input-number', 'max');

    expect(withWithAttributeWidth).toBe('200');
    expect(withWithAttributeIndex).toBe('1');
    expect(inputNumberMin).toBe('0');
    expect(inputNumberMax).toBe('100');
  });

  test('get CSS properties', () => {
    const targetIdWidth = anime.get('#target-id', 'width');
    const cssPrpertiesWidth = anime.get('.css-properties', 'width');
    const withInlineStylesWidth = anime.get('.with-inline-styles', 'width');

    expect(targetIdWidth).toBe('0px');
    expect(cssPrpertiesWidth).toBe('150px');
    expect(withInlineStylesWidth).toBe('200px');
  });

  test('get CSS transforms', () => {
    const withInlineStylesTranslateX = anime.get('.with-inline-transforms', 'translateX');
    const withInlineStylesTranslateY = anime.get('.with-inline-transforms', 'translateY');

    expect(withInlineStylesTranslateX).toBe('10px');
    expect(withInlineStylesTranslateY).toBe('20px');
  });

  test('get Object properties and convert unit', () => {
    const targetIdWidth = anime.get('#target-id', 'width', 'rem');
    // const cssPrpertiesWidth = anime.get('.css-properties', 'width');
    // const withInlineStylesWidth = anime.get('.with-inline-styles', 'width');

    expect(targetIdWidth).toBe('0rem');
    // expect(cssPrpertiesWidth).toBe('150px');
    // expect(withInlineStylesWidth).toBe('200px');
  });
});
