
import * as employeesApi from './employees';
import * as projectsApi from './projects';
import * as recommendationsApi from './recommendations';
import * as filesApi from './files';
import * as usersApi from './users';
import * as ilbamApi from './ilbam';

// Export a properly structured API object
export const api = {
  employees: employeesApi,
  projects: projectsApi,
  recommendations: recommendationsApi,
  files: filesApi,
  users: usersApi,
  ilbam: ilbamApi
};

// For backward compatibility with older imports
export { employeesApi, projectsApi, recommendationsApi, filesApi, usersApi, ilbamApi };
