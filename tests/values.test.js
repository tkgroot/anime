import {
  valueTypes,
} from '../src/consts.js';

describe('Values', () => {

  const numberTypeTestTarget = {
    number: 1,
    decimals: 1.2,
    exponent: 1.23456e+5,
    func: 1337,
    numberString: '1',
    decimalsString: '1.2',
    exponentString: '1.23456e+5',
    funcString: '1337',
  }

  test('Number type values from numbers', () => {
    const animation = anime({
      targets: numberTypeTestTarget,
      number: 42,
      decimals: 42,
      exponent: 42,
      func: () => 42,
      numberString: 42,
      decimalsString: 42,
      exponentString: 42,
      funcString: () => 42,
    });

    animation.animations.forEach( a => {
      expect(a.tweens[0].from.type).toBe(valueTypes.NUMBER);
      expect(a.tweens[0].to.type).toBe(valueTypes.NUMBER);
    });
  });

  test('Number type values from strings', () => {
    const animation = anime({
      targets: numberTypeTestTarget,
      number: '42',
      decimals: '42',
      exponent: '42',
      func: () => '42',
      numberString: '42',
      decimalsString: '42',
      exponentString: '42',
      funcString: () => '42',
    });

    animation.animations.forEach( a => {
      expect(a.tweens[0].from.type).toBe(valueTypes.NUMBER);
      expect(a.tweens[0].to.type).toBe(valueTypes.NUMBER);
    });
  });

  test('Number type values from relative values operators', () => {
    const animation = anime({
      targets: numberTypeTestTarget,
      number: '+=42',
      decimals: '+=42',
      exponent: '+=42',
      func: () => '+=42',
      numberString: '+=42',
      decimalsString: '+=42',
      exponentString: '+=42',
      funcString: () => '+=42',
    });

    animation.animations.forEach( a => {
      expect(a.tweens[0].from.type).toBe(valueTypes.NUMBER);
      expect(a.tweens[0].to.type).toBe(valueTypes.NUMBER);
      expect(a.tweens[0].to.operator).toBe('+');
    });
  });

  const unitTypeTestTarget = {
    number: 1,
    decimals: 1.2,
    exponent: 1.23456e+5,
    func: 1337,
    numberUnit: '1px',
    decimalsUnit: '1.2px',
    exponentUnit: '1.23456e+5px',
    funcUnit: '1337px',
  }

  test('Unit type values', () => {
    const animation = anime({
      targets: unitTypeTestTarget,
      number: '42px',
      decimals: '42px',
      exponent: '42px',
      func: () => '42px',
      numberUnit: 42,
      decimalsUnit: 42,
      exponentUnit: 42,
      funcUnit: () => 42,
    });

    animation.animations.forEach( a => {
      expect(a.tweens[0].from.type).toBe(valueTypes.UNIT);
      expect(a.tweens[0].from.unit).toBe('px');
      expect(a.tweens[0].to.type).toBe(valueTypes.UNIT);
      expect(a.tweens[0].to.number).toBe(42);
      expect(a.tweens[0].to.unit).toBe('px');
    });
  });

  const colorTypeTestTarget = {
    HEX3: '#f99',
    HEX6: '#ff9999',
    RGB: 'rgb(255, 153, 153)',
    HSL: 'hsl(0, 100%, 80%)',
    HEX3A: '#f999',
    HEX6A: '#ff999999',
    RGBA: 'rgba(255, 153, 153, .6)',
    HSLA: 'hsla(0, 100%, 80%, .6)',
    HEX3: '#0FF',
    HEX6: '#00FFFF',
    RGB: 'rgb(0, 255, 255)',
    HSL: 'hsl(180, 100%, 50%)',
    HEX3A: '#0FFC',
    HEX6A: '#00FFFFCC',
    RGBA: 'rgba(0, 255, 255, .8)',
    HSLA: 'hsla(180, 100%, 50%, .8)',
    func: 'hsla(180, 100%, 50%, .8)',
  }

  test('Color type values', () => {
    const animation = anime({
      targets: colorTypeTestTarget,
      HEX3: 'hsla(180, 100%, 50%, .8)',
      HEX6: 'hsla(180, 100%, 50%, .8)',
      RGB: 'hsla(180, 100%, 50%, .8)',
      HSL: 'hsla(180, 100%, 50%, .8)',
      HEX3A: 'hsla(180, 100%, 50%, .8)',
      HEX6A: 'hsla(180, 100%, 50%, .8)',
      RGBA: 'hsla(180, 100%, 50%, .8)',
      HSLA: 'hsla(180, 100%, 50%, .8)',
      HEX3: 'hsla(180, 100%, 50%, .8)',
      HEX6: 'hsla(180, 100%, 50%, .8)',
      RGB: 'hsla(180, 100%, 50%, .8)',
      HSL: 'hsla(180, 100%, 50%, .8)',
      HEX3A: 'hsla(180, 100%, 50%, .8)',
      HEX6A: 'hsla(180, 100%, 50%, .8)',
      RGBA: 'hsla(180, 100%, 50%, .8)',
      HSLA: 'hsla(180, 100%, 50%, .8)',
      func: () => 'hsla(180, 100%, 50%, .8)',
    });

    animation.animations.forEach( a => {
      expect(a.tweens[0].from.type).toBe(valueTypes.COLOR);
      expect(a.tweens[0].to.type).toBe(valueTypes.COLOR);
      expect(a.tweens[0].to.numbers).toStrictEqual([0, 255, 255, .8]);
    });
  });

  test('Complex type values', () => {

    const complexTypeTestTarget = {
      whiteSpace: '0 1 2 1.234',
      mixedTypes: 'auto 20px auto 2rem',
      cssFilter: 'blur(100px) constrast(200)',
      func: 'blur(100px) constrast(200)',
      whiteSpaceFromNumber: 10,
      mixedTypesFromNumber: 10,
      cssFilterFromNumber: 10,
      funcFromNumber: 10,
    }

    const animation = anime({
      targets: complexTypeTestTarget,
      whiteSpace: '42 42 42 42',
      mixedTypes: 'auto 42px auto 42rem',
      cssFilter: 'blur(42px) constrast(42)',
      func: () => 'blur(42px) constrast(42)',
      whiteSpaceFromNumber: '42 42 42 42',
      mixedTypesFromNumber: 'auto 42px auto 42rem',
      cssFilterFromNumber: 'blur(42px) constrast(42)',
      funcFromNumber: () => 'blur(42px) constrast(42)',
    });

    animation.animations.forEach( a => {
      expect(a.tweens[0].from.type).toBe(valueTypes.COMPLEX);
      expect(a.tweens[0].to.type).toBe(valueTypes.COMPLEX);
      if (a.tweens[0].to.numbers.length === 4) {
        expect(a.tweens[0].to.numbers).toStrictEqual([42, 42, 42, 42]);
      } else {
        expect(a.tweens[0].to.numbers).toStrictEqual([42, 42]);
      }
    });
  });

  test('Function based values', () => {
    const animation = anime({
      targets: '.target-class',
      autoplay: false,
      translateX: (el, i, total) => {
        return el.getAttribute('data-index');
      },
      duration: (el, i, total) => {
        const index = parseFloat(el.dataset.index);
        return total + ((i + index) * 100);
      },
      delay: (el, i, total) => {
        const index = parseFloat(el.dataset.index);
        return total + ((i + index) * 100);
      },
      endDelay: (el, i, total) => {
        const index = parseFloat(el.dataset.index);
        return total + ((i + index) * 100);
      }
    });

    // Property value
    expect(animation.animations[0].tweens[0].from.type).toBe(valueTypes.UNIT);
    expect(animation.animations[1].tweens[0].from.type).toBe(valueTypes.UNIT);
    expect(animation.animations[2].tweens[0].from.type).toBe(valueTypes.UNIT);
    expect(animation.animations[3].tweens[0].from.type).toBe(valueTypes.UNIT);

    expect(animation.animations[0].tweens[0].from.number).toBe(0);
    expect(animation.animations[1].tweens[0].from.number).toBe(0);
    expect(animation.animations[2].tweens[0].from.number).toBe(0);
    expect(animation.animations[3].tweens[0].from.number).toBe(0);

    expect(animation.animations[0].tweens[0].from.unit).toBe('px');
    expect(animation.animations[1].tweens[0].from.unit).toBe('px');
    expect(animation.animations[2].tweens[0].from.unit).toBe('px');
    expect(animation.animations[3].tweens[0].from.unit).toBe('px');

    expect(animation.animations[0].tweens[0].to.type).toBe(valueTypes.UNIT);
    expect(animation.animations[1].tweens[0].to.type).toBe(valueTypes.UNIT);
    expect(animation.animations[2].tweens[0].to.type).toBe(valueTypes.UNIT);
    expect(animation.animations[3].tweens[0].to.type).toBe(valueTypes.UNIT);

    expect(animation.animations[0].tweens[0].to.number).toBe(0);
    expect(animation.animations[1].tweens[0].to.number).toBe(1);
    expect(animation.animations[2].tweens[0].to.number).toBe(2);
    expect(animation.animations[3].tweens[0].to.number).toBe(3);

    expect(animation.animations[0].tweens[0].to.unit).toBe('px');
    expect(animation.animations[1].tweens[0].to.unit).toBe('px');
    expect(animation.animations[2].tweens[0].to.unit).toBe('px');
    expect(animation.animations[3].tweens[0].to.unit).toBe('px');

    expect(animation.animations[0].currentValue).toBe('0px');
    expect(animation.animations[1].currentValue).toBe('0px');
    expect(animation.animations[2].currentValue).toBe('0px');
    expect(animation.animations[3].currentValue).toBe('0px');

    animation.seek(animation.duration);

    expect(animation.animations[0].currentValue).toBe('0px');
    expect(animation.animations[1].currentValue).toBe('1px');
    expect(animation.animations[2].currentValue).toBe('2px');
    expect(animation.animations[3].currentValue).toBe('3px');

    // Duration
    expect(animation.animations[0].tweens[0].duration).toBe(4);
    expect(animation.animations[1].tweens[0].duration).toBe(204);
    expect(animation.animations[2].tweens[0].duration).toBe(404);
    expect(animation.animations[3].tweens[0].duration).toBe(604);

    // Delay
    expect(animation.animations[0].tweens[0].delay).toBe(4);
    expect(animation.animations[1].tweens[0].delay).toBe(204);
    expect(animation.animations[2].tweens[0].delay).toBe(404);
    expect(animation.animations[3].tweens[0].delay).toBe(604);

    // EndDelay
    expect(animation.animations[0].tweens[0].endDelay).toBe(4);
    expect(animation.animations[1].tweens[0].endDelay).toBe(204);
    expect(animation.animations[2].tweens[0].endDelay).toBe(404);
    expect(animation.animations[3].tweens[0].endDelay).toBe(604);
  });

  test('Get CSS computed values', () => {
    const animation = anime({
      targets: '.css-properties',
      width: 100,
      fontSize: 10,
    });

    animation.seek(animation.duration);

    expect(animation.animations[0].tweens[0].from.type).toBe(valueTypes.UNIT);
    expect(animation.animations[1].tweens[0].from.type).toBe(valueTypes.UNIT);
    expect(animation.animations[0].tweens[0].from.number).toBe(150);
    expect(animation.animations[1].tweens[0].from.number).toBe(20);
    expect(animation.animations[0].tweens[0].from.unit).toBe('px');
    expect(animation.animations[1].tweens[0].from.unit).toBe('px');

    expect(animation.animations[0].tweens[0].to.type).toBe(valueTypes.UNIT);
    expect(animation.animations[1].tweens[0].to.type).toBe(valueTypes.UNIT);
    expect(animation.animations[0].tweens[0].to.number).toBe(100);
    expect(animation.animations[1].tweens[0].to.number).toBe(10);
    expect(animation.animations[0].tweens[0].to.unit).toBe('px');
    expect(animation.animations[1].tweens[0].to.unit).toBe('px');

    expect(animation.animations[0].currentValue).toBe('100px');
    expect(animation.animations[1].currentValue).toBe('10px');
  });

  test('Get CSS inline values', () => {
    const animation = anime({
      targets: '.with-inline-styles',
      width: 100,
    });

    animation.seek(animation.duration);

    expect(animation.animations[0].tweens[0].from.type).toBe(valueTypes.UNIT);
    expect(animation.animations[0].tweens[0].from.number).toBe(200);
    expect(animation.animations[0].tweens[0].from.unit).toBe('px');

    expect(animation.animations[0].tweens[0].to.type).toBe(valueTypes.UNIT);
    expect(animation.animations[0].tweens[0].to.number).toBe(100);
    expect(animation.animations[0].tweens[0].to.unit).toBe('px');
    
    expect(animation.animations[0].currentValue).toBe('100px');
  });

  test('Get default transforms values', () => {
    const animation = anime({
      targets: '#target-id',
      translateX: 100,
      translateY: 100,
      translateZ: 100,
      rotate: 360,
      rotateX: 360,
      rotateY: 360,
      rotateZ: 360,
      skew: 360,
      skewX: 360,
      skewY: 360,
      scale: 10,
      scaleX: 10,
      scaleY: 10,
      scaleZ: 10,
      perspective: 1000,
    });

    // Translate
    expect(animation.animations[0].tweens[0].from.unit).toBe('px');
    expect(animation.animations[1].tweens[0].from.unit).toBe('px');
    expect(animation.animations[2].tweens[0].from.unit).toBe('px');
    expect(animation.animations[0].tweens[0].from.number).toBe(0);
    expect(animation.animations[1].tweens[0].from.number).toBe(0);
    expect(animation.animations[2].tweens[0].from.number).toBe(0);
    // Rotate
    expect(animation.animations[3].tweens[0].from.unit).toBe('deg');
    expect(animation.animations[4].tweens[0].from.unit).toBe('deg');
    expect(animation.animations[5].tweens[0].from.unit).toBe('deg');
    expect(animation.animations[6].tweens[0].from.unit).toBe('deg');
    expect(animation.animations[3].tweens[0].from.number).toBe(0);
    expect(animation.animations[4].tweens[0].from.number).toBe(0);
    expect(animation.animations[5].tweens[0].from.number).toBe(0);
    expect(animation.animations[6].tweens[0].from.number).toBe(0);
    // Skew
    expect(animation.animations[7].tweens[0].from.unit).toBe('deg');
    expect(animation.animations[8].tweens[0].from.unit).toBe('deg');
    expect(animation.animations[9].tweens[0].from.unit).toBe('deg');
    expect(animation.animations[7].tweens[0].from.number).toBe(0);
    expect(animation.animations[8].tweens[0].from.number).toBe(0);
    expect(animation.animations[9].tweens[0].from.number).toBe(0);
    // Scale
    expect(animation.animations[10].tweens[0].from.unit).toBe(undefined);
    expect(animation.animations[11].tweens[0].from.unit).toBe(undefined);
    expect(animation.animations[12].tweens[0].from.unit).toBe(undefined);
    expect(animation.animations[13].tweens[0].from.unit).toBe(undefined);
    expect(animation.animations[10].tweens[0].from.number).toBe(1);
    expect(animation.animations[11].tweens[0].from.number).toBe(1);
    expect(animation.animations[12].tweens[0].from.number).toBe(1);
    expect(animation.animations[13].tweens[0].from.number).toBe(1);
    // Perspective
    expect(animation.animations[14].tweens[0].from.unit).toBe('px');
    expect(animation.animations[14].tweens[0].from.number).toBe(0);
  });

  test('Values with white space', () => {
    const animation = anime({
      targets: '#target-id',
      backgroundSize: ['auto 100%', 'auto 200%'],
      duration: 10
    });

    expect(animation.animations[0].tweens[0].from.type).toBe(valueTypes.COMPLEX);
    expect(animation.animations[0].tweens[0].from.numbers[0]).toBe(100);
    expect(animation.animations[0].tweens[0].from.strings[0]).toBe('auto ');
    expect(animation.animations[0].tweens[0].from.strings[1]).toBe('%');

    expect(animation.animations[0].tweens[0].to.type).toBe(valueTypes.COMPLEX);
    expect(animation.animations[0].tweens[0].to.numbers[0]).toBe(200);
    expect(animation.animations[0].tweens[0].to.strings[0]).toBe('auto ');
    expect(animation.animations[0].tweens[0].to.strings[1]).toBe('%');

    expect(animation.animations[0].currentValue).toBe('auto 100%');

    animation.seek(animation.duration);

    expect(animation.animations[0].currentValue).toBe('auto 200%');
  });

  test('Complex CSS values', () => {
    const animation = anime({
      targets: '#target-id',
      filter: 'blur(10px) constrast(200)',
      translateX: 'calc( calc(15px * 2) -42rem)',
      duration: 10
    });

    animation.seek(animation.duration);
    expect(animation.animations[0].currentValue).toBe('blur(10px) constrast(200)');
    expect(animation.animations[0].tweens[0].to.numbers).toStrictEqual([10, 200]);
    expect(animation.animations[1].currentValue).toBe('calc( calc(15px * 2) -42rem)');
    expect(animation.animations[1].tweens[0].to.numbers).toStrictEqual([15, 2, -42]);
  });

  test('Relative values with operators +=, -=, *=', () => {
    const relativeEl = document.querySelector('#target-id');
    relativeEl.style.transform = 'translateX(100px)';
    relativeEl.style.width = '28px';
    const animation = anime({
      targets: '#target-id',
      translateX: '*=2.5', // 100px * 2.5 = '250px',
      width: '-=20px', // 28 - 20 = '8px',
      rotate: '+=2turn', // 0 + 2 = '2turn',
      duration: 10
    });

    expect(animation.animations[0].currentValue).toBe('100px');
    expect(animation.animations[1].currentValue).toBe('28px');
    expect(animation.animations[2].currentValue).toBe('0turn');

    animation.seek(animation.duration);

    expect(animation.animations[0].currentValue).toBe('250px');
    expect(animation.animations[1].currentValue).toBe('8px');
    expect(animation.animations[2].currentValue).toBe('2turn');
  });

  test('Relative values inside from to values', () => {
    const relativeEl = document.querySelector('#target-id');
    relativeEl.style.transform = 'translateX(100px)';
    relativeEl.style.width = '28px';
    const animation = anime({
      targets: '#target-id',
      translateX: ['*=2.5', 10], // Relative from value
      width: [100, '-=20px'], // Relative to value
      rotate: ['+=2turn', '-=1turn'], // Relative from and to values
      duration: 10,
    });

    expect(animation.animations[0].currentValue).toBe('250px');
    expect(animation.animations[1].currentValue).toBe('100px');
    expect(animation.animations[2].currentValue).toBe('2turn');

    animation.seek(animation.duration);

    expect(animation.animations[0].currentValue).toBe('10px');
    expect(animation.animations[1].currentValue).toBe('80px');
    expect(animation.animations[2].currentValue).toBe('1turn');

  });
});
