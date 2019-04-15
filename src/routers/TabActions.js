const REFRESH_TABS = 'Navigation/REFRESH_TABS';
const REFRESH_TABS_DONE = 'Navigation/REFRESH_TABS_DONE';

const refreshTabs = payload => ({
  type: REFRESH_TABS,
  ...payload
});

const refreshTabsDone = payload => ({
  type: REFRESH_TABS_DONE,
  ...payload
});

export default {
  REFRESH_TABS,
  REFRESH_TABS_DONE,

  refreshTabs,
  refreshTabsDone
};