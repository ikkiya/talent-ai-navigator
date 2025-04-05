
import * as employeesApi from './employees';
import * as projectsApi from './projects';
import * as recommendationsApi from './recommendations';
import * as filesApi from './files';

// Export a properly structured API object
export const api = {
  employees: employeesApi,
  projects: projectsApi,
  recommendations: recommendationsApi,
  files: filesApi
};

// Re-export all individual modules for direct imports if needed
// But rename them to avoid conflicts
export { employeesApi, projectsApi, recommendationsApi, filesApi };
