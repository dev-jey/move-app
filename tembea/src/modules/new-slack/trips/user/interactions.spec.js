import Interactions from './interactions';
import { DialogPrompts } from '../../../slack/RouteManagement/rootFile';

describe('Interactions', () => {
  let payload;
  let state;
  let dialogSpy;

  beforeEach(() => {
    payload = { user: { id: 'U1567' } };
    state = { origin: 'https;//github.com' };
    dialogSpy = jest.spyOn(DialogPrompts, 'sendDialog').mockResolvedValue();
  });

  describe('sendTripReasonForm', () => {
    it('should send trip reason form', async () => {
      await Interactions.sendTripReasonForm(payload, state);

      expect(dialogSpy).toHaveBeenCalledTimes(1);
      expect(dialogSpy).toHaveBeenCalledWith((expect.objectContaining({
        title: 'Reason for booking trip',
        submit_label: 'Submit'
      })), payload);
    });
  });
});
