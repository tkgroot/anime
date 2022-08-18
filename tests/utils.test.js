describe('Utils', () => {
  test('Get Object properties', () => {
    const plainValue = anime.get(testObject, 'plainValue');
    const valueWithUnit = anime.get(testObject, 'valueWithUnit');
    const multiplePLainValues = anime.get(testObject, 'multiplePLainValues');
    const multipleValuesWithUnits = anime.get(testObject, 'multipleValuesWithUnits');

    expect(plainValue).toBe(10);
    expect(valueWithUnit).toBe('10px');
    expect(multiplePLainValues).toBe('16 32 64 128');
    expect(multipleValuesWithUnits).toBe('16px 32em 64% 128ch');
  });

  test('Set Object properties', () => {
    anime.set(testObject, {
      plainValue: 42,
      valueWithUnit: '42px',
      multiplePLainValues: '40 41 42 43',
      multipleValuesWithUnits: '40px 41em 42% 43ch',
    });

    expect(testObject.plainValue).toBe(42);
    expect(testObject.valueWithUnit).toBe('42px');
    expect(testObject.multiplePLainValues).toBe('40 41 42 43');
    expect(testObject.multipleValuesWithUnits).toBe('40px 41em 42% 43ch');
  });

  test('Get DOM attributes', () => {
    const withWithAttributeWidth = anime.get('.with-width-attribute', 'width');
    const withWithAttributeIndex = anime.get('.with-width-attribute', 'data-index');
    const inputNumberMin = anime.get('#input-number', 'min');
    const inputNumberMax = anime.get('#input-number', 'max');

    expect(withWithAttributeWidth).toBe('200');
    expect(withWithAttributeIndex).toBe('1');
    expect(inputNumberMin).toBe('0');
    expect(inputNumberMax).toBe('100');
  });

  test('Set DOM attributes', () => {
    anime.set('.with-width-attribute', {
      width: 41,
      'data-index': 42
    });

    anime.set('#input-number', {
      min: 41,
      max: 42
    });

    const withWithAttributeWidth = anime.get('.with-width-attribute', 'width');
    const withWithAttributeIndex = anime.get('.with-width-attribute', 'data-index');
    const inputNumberMin = anime.get('#input-number', 'min');
    const inputNumberMax = anime.get('#input-number', 'max');

    expect(withWithAttributeWidth).toBe('41');
    expect(withWithAttributeIndex).toBe('42');
    expect(inputNumberMin).toBe('41');
    expect(inputNumberMax).toBe('42');
  });

  test('Get CSS properties', () => {
    const targetIdWidth = anime.get('#target-id', 'width');
    const cssPrpertiesWidth = anime.get('.css-properties', 'width');
    const withInlineStylesWidth = anime.get('.with-inline-styles', 'width');

    expect(targetIdWidth).toBe('0px');
    expect(cssPrpertiesWidth).toBe('150px');
    expect(withInlineStylesWidth).toBe('200px');
  });

  test('Set CSS properties', () => {
    anime.set(['#target-id', '.css-properties', '.with-inline-styles'], {
      width: 42
    })

    const targetIdWidth = anime.get('#target-id', 'width');
    const cssPrpertiesWidth = anime.get('.css-properties', 'width');
    const withInlineStylesWidth = anime.get('.with-inline-styles', 'width');

    expect(targetIdWidth).toBe('42px');
    expect(cssPrpertiesWidth).toBe('42px');
    expect(withInlineStylesWidth).toBe('42px');
  });

  test('Get CSS transforms', () => {
    anime.set(['#target-id', '.with-inline-transforms'], {
      translateX: 41,
      translateY: 42,
      rotate: 43,
    });

    const withInlineStylesTranslateX = anime.get('.with-inline-transforms', 'translateX');
    const withInlineStylesTranslateY = anime.get('.with-inline-transforms', 'translateY');
    const withInlineStylesRotate = anime.get('.with-inline-transforms', 'rotate');

    expect(withInlineStylesTranslateX).toBe('41px');
    expect(withInlineStylesTranslateY).toBe('42px');
    expect(withInlineStylesRotate).toBe('43deg');
  });

  test('Get CSS transforms', () => {
    const withInlineStylesTranslateX = anime.get('.with-inline-transforms', 'translateX');
    const withInlineStylesTranslateY = anime.get('.with-inline-transforms', 'translateY');

    expect(withInlineStylesTranslateX).toBe('10px');
    expect(withInlineStylesTranslateY).toBe('20px');
  });

  test('Get Object properties and convert unit', () => {
    const targetIdWidth = anime.get('#target-id', 'width', 'rem');
    // const cssPrpertiesWidth = anime.get('.css-properties', 'width');
    // const withInlineStylesWidth = anime.get('.with-inline-styles', 'width');

    expect(targetIdWidth).toBe('0rem');
    // expect(cssPrpertiesWidth).toBe('150px');
    // expect(withInlineStylesWidth).toBe('200px');
  });

  test('Set Object properties to specific unit', () => {
    anime.set(testObject, {
      plainValue: '42px',
      valueWithUnit: '42rem',
      multiplePLainValues: '40% 41px 42rem 43vh',
      multipleValuesWithUnits: '40% 41px 42rem 43vh',
    });

    expect(testObject.plainValue).toBe('42px');
    expect(testObject.valueWithUnit).toBe('42rem');
    expect(testObject.multiplePLainValues).toBe('40% 41px 42rem 43vh');
    expect(testObject.multipleValuesWithUnits).toBe('40% 41px 42rem 43vh');
  });

  test('Set properties with function based values', () => {
    anime.set('.target-class', {
      translateX: (el, i, t) => 7649986 + i,
    })

    const targetEl1Width = anime.get('.target-class:nth-child(1)', 'translateX');
    const targetEl2Width = anime.get('.target-class:nth-child(2)', 'translateX');
    const targetEl3Width = anime.get('.target-class:nth-child(3)', 'translateX');
    const targetEl4Width = anime.get('.target-class:nth-child(4)', 'translateX');

    expect(targetEl1Width).toBe('7649986px');
    expect(targetEl2Width).toBe('7649987px');
    expect(targetEl3Width).toBe('7649988px');
    expect(targetEl4Width).toBe('7649989px');
  });
});
