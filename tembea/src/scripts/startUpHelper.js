import dotenv from 'dotenv';
import bugsnagHelper from '../helpers/bugsnagHelper';
import models from '../database/models';
import RoleService from '../services/RoleService';
import cache from '../cache';
import { DEFAULT_LOCATIONS, DEFAULT_ADDRESSES } from '../helpers/constants';
import LocationService from '../services/LocationService';

dotenv.config();

const { User, Address } = models;

class StartUpHelper {
  static async ensureSuperAdminExists() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const slackId = process.env.SUPER_ADMIN_SLACK_ID;
    const userName = StartUpHelper.getUserNameFromEmail(email);
    const {
      APPRENTICESHIP_SUPER_ADMIN_EMAIL: email2,
      APPRENTICESHIP_SUPER_ADMIN_SLACK_ID: slackId2
    } = process.env;

    try {
      const user1Promise = User.findOrCreate({
        where: { email },
        defaults: { slackId, name: userName }
      });

      const user2Promise = User.findOrCreate({
        where: { email: email2 },
        defaults: { slackId: slackId2, name: StartUpHelper.getUserNameFromEmail(email2) }
      });
      
      const [[user], [user2]] = await Promise.all([user1Promise, user2Promise]);
      const [role] = await RoleService.createOrFindRole('Super Admin');
      await Promise.all([user.addRoles(role), user2.addRoles(role)]);
      return;
    } catch (error) {
      bugsnagHelper.log(error);
    }
  }

  static async flushStaleCache() {
    cache.flush();
  }

  static async addDefaultAddresses() {
    const opPromises = DEFAULT_LOCATIONS.map(async (loc, index) => {
      const location = await LocationService.createLocation(loc.longitude, loc.latitude);
      const address = DEFAULT_ADDRESSES[index];
      address.locationId = location.id;
      const existingAddress = await Address.findOne({ where: { address: address.address } });
      if (existingAddress && existingAddress.dataValues) {
        return existingAddress.update({
          locationId: address.locationId
        });
      }
      return Address.create(address);
    });
    await Promise.all(opPromises);
  }

  static getUserNameFromEmail(email) {
    let firstName;

    [firstName] = email.split('@');
    const getIndex = firstName.indexOf('.');
    if (getIndex === -1) {
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }
    const fullName = email.split('@')[0].split('.');
    [firstName] = fullName;
    const firstNameCapitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const lastName = fullName[fullName.length - 1];
    const lastNameCapitalized = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    return (`${firstNameCapitalized} ${lastNameCapitalized}`);
  }
}

export default StartUpHelper;
