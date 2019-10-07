class SubscriptionHelper {
static unsubscribeHelper (subscriptions: Array<any>) {
  subscriptions.forEach(subscription => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });
}
}
export default SubscriptionHelper;
