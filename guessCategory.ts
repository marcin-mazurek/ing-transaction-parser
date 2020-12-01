import {categoryPatterns} from './categoryPatterns';

export const guessCategory = name => {
  for (const pattern of Object.keys(categoryPatterns)) {
    if (name.toUpperCase().indexOf(pattern.toUpperCase()) !== -1)
      return categoryPatterns[pattern];
  }

  return 'Other';
};