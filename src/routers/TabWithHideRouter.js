import { SwitchRouter } from 'react-navigation';
import TabActions from './TabActions';
function withDefaultValue(obj, key, defaultValue) {
  if (obj.hasOwnProperty(key) && typeof obj[key] !== 'undefined') {
    return obj;
  }

  obj[key] = defaultValue;
  return obj;
}

const getActiveRouteKey = route => {
  if (route.routes && route.routes[route.index]) {
    return getActiveRouteKey(route.routes[route.index]);
  }
  return route.key;
};
export default (routeConfigs, config = {}) => {
  config = { ...config };
  config = withDefaultValue(config, 'resetOnBlur', false);
  config = withDefaultValue(config, 'backBehavior', 'initialRoute');

  const switchRouter = SwitchRouter(routeConfigs, config);

  return {
    ...switchRouter,

    getActionCreators(route, navStateKey) {
      return {
        refreshTabs: () => TabActions.refreshTabs({ key: navStateKey }),
        refreshTabsDone: () => TabActions.refreshTabsDone({key: navStateKey}),
        ...switchRouter.getActionCreators(route, navStateKey)
      };
    },

    getStateForAction(action, state) {
      // Set up the initial state if needed
      if (!state) {
        return {
          ...switchRouter.getStateForAction(action, undefined),
          refreshTabs: false
        };
      }

      const isRouterTargeted = action.key == null || action.key === state.key;

      if (isRouterTargeted) {

        // Only handle actions that are meant for this tabBottom, as specified by action.key.
        if (action.type === TabActions.REFRESH_TABS) {
          return {
            ...state,
            refreshTabs: true
          };
        }

        if (action.type === TabActions.REFRESH_TABS_DONE) {
          return {
            ...state,
            refreshTabs: false
          };
        }
      }

      // Fall back on switch router for screen switching logic, and handling of child routers
      const switchedState = switchRouter.getStateForAction(action, state);

      if (switchedState === null) {
        // The switch router or a child router is attempting to swallow this action. We return null to allow this.
        return null;
      }

      // Has the switch router changed the state?
      if (switchedState !== state) {
        if (getActiveRouteKey(switchedState) !== getActiveRouteKey(state)) {
          // If any navigation has happened, make sure to close the drawer
          return {
            ...switchedState,
            closeId: state.closeId + 1,
          };
        }

        // At this point, return the state as defined by the switch router.
        // The active route key hasn't changed, so this most likely means that a child router has returned
        // a new state like a param change, but the same key is still active and the drawer will remain open
        return switchedState;
      }

      return state;
    }
  }
};
