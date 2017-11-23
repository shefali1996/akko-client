import generateHandleActions from 'redux/state-handler';
import { LIST_PROJECTS, CREATE_PROJECT, READ_PROJECT } from 'redux/constants';

const apiStates = [
  { type: LIST_PROJECTS, name: 'projects', apiField: 'data' },
  { type: CREATE_PROJECT, name: 'createProject', append: 'projects', apiField: 'data' },
  { type: READ_PROJECT, name: 'project', apiField: 'data', clear: true },
];

const instantStates = [];

const listValues = ['projects'];

export default generateHandleActions({ apiStates, instantStates, listValues });
