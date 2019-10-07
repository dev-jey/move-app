const prefix = 'manager_trip_';

const managerTripActions = Object.freeze({
  managerApprove: `${prefix}approval`,
  managerDecline: `${prefix}decline`,
  managerReasonApprove: `${prefix}reason_approve`,
  managerReasonDecline: `${prefix}reason_decline`
});
export default managerTripActions;
