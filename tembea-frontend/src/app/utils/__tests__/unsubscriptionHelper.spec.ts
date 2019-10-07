import SubscriptionHelper from '../unsubscriptionHelper';



describe('SubscriptionHelper', () => {
  it('should unsubscribe from events', () => {
    jest.spyOn(SubscriptionHelper, 'unsubscribeHelper').mockImplementation(
      jest.fn());
     SubscriptionHelper.unsubscribeHelper(['a', 'b']);
     expect(SubscriptionHelper.unsubscribeHelper).toHaveBeenCalled();
  });
});
