
import * as employees from './employees';
import * as projects from './projects';
import * as recommendations from './recommendations';
import * as files from './files';

// Export a properly structured API object
export const api = {
  employees,
  projects,
  recommendations,
  files
};

// Re-export all individual modules for direct imports
export * from './employees';
export * from './projects';
export * from './recommendations';
export * from './files';
