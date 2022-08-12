describe('SVG', () => {
  test('setDashoffset', () => {
    const dashOffsetAnimation = anime({
      targets: ['#line1', '#line2', '#circle', '#polygon', '#polyline', '#path', '#rect'],
      strokeDashoffset: [anime.setDashoffset, 0]
    });

    expect(dashOffsetAnimation.animations[0].tweens[0].from.numbers[0]).toBeCloseTo(138.59292602539062, -.5);
    expect(dashOffsetAnimation.animations[1].tweens[0].from.numbers[0]).toBeCloseTo(138.59292602539062, -.5);
    expect(dashOffsetAnimation.animations[2].tweens[0].from.numbers[0]).toBeCloseTo(313.6517028808594, -.5);
  });

  test('getPath', () => {
    const path = anime.path('#path');
    expect(path('x').totalLength).toBeDefined();
    expect(path('y').totalLength).toBeDefined();
    expect(path('angle').totalLength).toBeDefined();
  });

  test('Path animation', () => {
    // const path = anime.path('#path');
    // const animation = anime({
    //   targets: '#target-id',
    //   translateX: path('x'),
    // });

    // el.getTotalLength() and el.points are not defined in the test environment
    // expect(dashOffsetAnimation.animations[3].tweens[0].from.numbers[0]).toBeCloseTo(399.06207275390625, -.5);
    // expect(dashOffsetAnimation.animations[4].tweens[0].from.numbers[0]).toBeCloseTo(322.62371826171875, -.5);
    // expect(dashOffsetAnimation.animations[5].tweens[0].from.numbers[0]).toBeCloseTo(335.6526184082031, -.5);

    // console.log(path('x').totalLength);
  });
});
