import {
  clamp,
  random,
} from './helpers.js';

import {
  parseEasings,
  penner,
} from './easings.js';

import {
  convertValueUnit,
} from './units.js';

import {
  getTargetValue,
  setTargetsValue,
} from './values.js';

import {
  setDashoffset,
  getPath,
} from './svg.js';

import {
  removeAnimatablesFromActiveInstances,
} from './animatables.js';

import {
  activeInstances,
} from './engine.js';

import {
  animate,
} from './animate.js';

import {
  createTimeline,
} from './timelines.js';

import {
  stagger,
} from './stagger.js';


const anime = animate;

anime.version = '__packageVersion__';
anime.speed = 1;
anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeAnimatablesFromActiveInstances;
anime.get = getTargetValue;
anime.set = (targets, properties = {}) => {
  properties.targets = targets;
  properties.duration = 0;
  const animation = animate(properties);
  // animation.seek(animation.duration);
  return animation;
};
anime.convertPx = convertValueUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = createTimeline;
anime.easing = parseEasings;
anime.penner = penner;
anime.clamp = clamp;
anime.random = random;

export default anime;
