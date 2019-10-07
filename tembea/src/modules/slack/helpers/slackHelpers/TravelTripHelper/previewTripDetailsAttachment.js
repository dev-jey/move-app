import { SlackAttachmentField } from '../../../SlackModels/SlackMessageModels';

export default (tripDetails) => {
  const {
    rider, dateTime, tripType, pickup, destination, noOfPassengers,
    riderPhoneNo, travelTeamPhoneNo, departmentName, flightNumber, requester,
    tripNote
  } = tripDetails;

  const timeFieldName = `${tripType === 'Airport Transfer' ? 'Flight' : 'Appointment'} Time`;
  const travelDateTime = tripDetails.flightDateTime || tripDetails.embassyVisitDateTime;

  return [
    new SlackAttachmentField('Passenger', `<@${rider}>`, true),
    new SlackAttachmentField('Passenger\'s Phone Number', riderPhoneNo, true),
    new SlackAttachmentField('Department', departmentName, true),
    new SlackAttachmentField('Number of Passengers', noOfPassengers, true),
    new SlackAttachmentField('Travel Team Phone Number', travelTeamPhoneNo, true),
    new SlackAttachmentField('Requester (Travel)', requester, true),
    new SlackAttachmentField('Pickup Location', pickup, true),
    new SlackAttachmentField('Destination', destination, true),
    new SlackAttachmentField('Pick-Up Time', dateTime, true),
    new SlackAttachmentField(timeFieldName, travelDateTime, true),
    new SlackAttachmentField('Trip Type', tripType, true),
    new SlackAttachmentField('Flight Number', flightNumber, true),
    new SlackAttachmentField('TripNotes', tripNote, true),
  ];
};
