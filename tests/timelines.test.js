describe('Timelines', () => {
  function createTimeline() {
    return anime.timeline({
      targets: '.target-class',
      delay: function(el, i) { return i * 20 }, // Can be inherited
      endDelay: function(el, i) { return (i + 1) * 10 }, // Can be inherited
      duration: 50, // Can be inherited
      easing: 'easeOutExpo', // Can be inherited
      direction: 'alternate', // Is not inherited
      loop: true // Is not inherited
    })
    .add({
      translateX: 250,
      // override the easing parameter
      easing: 'spring',
    })
    .add({
      opacity: .5,
      scale: 2
    })
    .add({
      // override the targets parameter
      targets: 'id="target-id',
      rotate: 180
    })
    .add({
      translateX: 0,
      scale: 1
    });
  }

  // const childTL0 = parameterInheritanceTL.children[0];
  // const childTL1 = parameterInheritanceTL.children[1];
  // const childTL2 = parameterInheritanceTL.children[2];
  // const childTL3 = parameterInheritanceTL.children[3];

  test('Root timeline delay should inherit the main parameters', () => {
    const parameterInheritanceTL = createTimeline();
    expect(parameterInheritanceTL.delay).toBe(0);
  });

  test('Root timeline endDelay should inherit the main parameters', () => {
    const parameterInheritanceTL = createTimeline();
    expect(parameterInheritanceTL.endDelay).toBe(40);
  });
});
