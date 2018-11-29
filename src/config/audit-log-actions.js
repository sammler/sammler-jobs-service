const _ = require('lodash');

const BASE_PROPS = {
  event_domain: 'jobs-service',
  source: '/jobs-service'
};

function getActorDetails(user) {
  return {
    username: user.local.username,
    email: user.local.email
  };
}

module.exports = {
  SUBJECT: 'jobs-service',
  cloudEvents: {
    saveJob: props => {
      return Object.assign({
        event: 'post',
        actor_group: _.get(props.user, ['tenant_id']),
        actor: props.user._id,
        actor_details: getActorDetails(props.user),
        action_type: 'CU',
        description: 'Save/Create a job.'
      }, BASE_PROPS);
    }
  }
};
