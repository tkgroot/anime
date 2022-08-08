import {
  emptyString,
} from './consts.js';

import {
  is,
  flattenArray,
  filterArray,
  arrayContains,
  toArray,
} from './helpers.js';

import {
  getElementTransforms,
} from './values.js';

import {
  activeInstances,
} from './engine.js';

function parseTargets(targets) {
  const targetsArray = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
  return filterArray(targetsArray, (item, pos, self) => self.indexOf(item) === pos);
}

export function getAnimatables(targets) {
  const parsed = parseTargets(targets);
  return parsed.map((t, i) => {
    return {
      target: t,
      id: i,
      total: parsed.length,
      transforms: {
        list: getElementTransforms(t),
        last: null,
        string: emptyString
      }
    }
  });
}

// Remove targets from animation

function removeAnimationsWithTargets(targetsArray, animations) {
  for (let a = animations.length; a--;) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}

function removeAnimationsWithTargetsFromIntance(targetsArray, instance) {
  const animations = instance.animations;
  const children = instance.children;
  for (let c = children.length; c--;) {
    const child = children[c];
    const childAnimations = child.animations;
    removeAnimationsWithTargets(targetsArray, childAnimations);
    if (!childAnimations.length && !child.children.length) children.splice(c, 1);
  }
  // Return early to prevent instances created without targets (and without animations) to be paused
  if (!animations.length) return;
  removeAnimationsWithTargets(targetsArray, animations);
  if (!animations.length && !children.length) instance.pause();
}

export function removeAnimatablesFromInstance(targets, instance) {
  const targetsArray = parseTargets(targets);
  removeAnimationsWithTargetsFromIntance(targetsArray, instance);
}

export function removeAnimatablesFromActiveInstances(targets) {
  const targetsArray = parseTargets(targets);
  for (let i = activeInstances.length; i--;) {
    const instance = activeInstances[i];
    removeAnimationsWithTargetsFromIntance(targetsArray, instance);
  }
}
