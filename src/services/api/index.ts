
import * as employeesApi from './employees';
import * as projectsApi from './projects';
import * as recommendationsApi from './recommendations';
import * as filesApi from './files';
import * as usersApi from './users';

// Export a properly structured API object
export const api = {
  employees: employeesApi,
  projects: projectsApi,
  recommendations: recommendationsApi,
  files: filesApi,
  users: usersApi
};

// For backward compatibility with older imports
export { employeesApi, projectsApi, recommendationsApi, filesApi, usersApi };
