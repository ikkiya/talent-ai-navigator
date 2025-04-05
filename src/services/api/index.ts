
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

// For backward compatibility with older imports
export { employeesApi, projectsApi, recommendationsApi, filesApi };
