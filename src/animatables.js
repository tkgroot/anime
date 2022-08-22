import {
  emptyString,
} from './consts.js';

import {
  is,
  flattenArray,
  filterArray,
  arrayContains,
  toArray,
} from './utils.js';

import {
  activeInstances,
} from './engine.js';

const animatablesMap = new Map();

function registerAnimatable(target, i, total) {
  let registeredAnimatable = animatablesMap.get(target);
  if (!registeredAnimatable) {
    registeredAnimatable = {
      target: target,
      id: i,
      total: total
    }
    if (is.dom(target)) {
      registeredAnimatable.isDOM = true;
      registeredAnimatable.transforms = {
        list: new Map(),
        string: emptyString
      }
    }
    if (is.svg(target)) registeredAnimatable.isSVG = true;
    animatablesMap.set(target, registeredAnimatable);
  }
  return registeredAnimatable;
}

function parseTargets(targets) {
  const targetsArray = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
  return filterArray(targetsArray, (item, pos, self) => self.indexOf(item) === pos);
}

export function getAnimatables(targets) {
  const parsed = parseTargets(targets);
  const total = parsed.length;
  return parsed.map((target, i) => {
    return registerAnimatable(target, i, total);
  });
}

// Remove targets from animation

function removeAnimationsWithTargets(targetsArray, animations) {
  for (let i = animations.length; i--;) {
    if (arrayContains(targetsArray, animations[i].animatable.target)) {
      animations.splice(i, 1);
    }
  }
}

function removeAnimationsWithTargetsFromIntance(targetsArray, instance) {
  const animations = instance.animations;
  const children = instance.children;
  for (let i = children.length; i--;) {
    const child = children[i];
    const childAnimations = child.animations;
    removeAnimationsWithTargets(targetsArray, childAnimations);
    if (!childAnimations.length && !child.children.length) children.splice(i, 1);
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
