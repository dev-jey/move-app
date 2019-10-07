import { Op } from 'sequelize';
import models from '../database/models';
import HttpError from '../helpers/errorHandler';
import bugsnagHelper from '../helpers/bugsnagHelper';

import LocationService from './LocationService';
import RemoveDataValues from '../helpers/removeDataValues';

const { Address, Location } = models;

class AddressService {
  /**
   * @description Get the address by address from the database
   * @param  {string} address The address of the address on the db
   * @returns {object} The http response object
   */
  static async findAddress(address) {
    try {
      const place = await Address.findOne({
        where: {
          address: { [Op.iLike]: `${address}%` }
        },
        include: ['location']
      });
      return place;
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.throwErrorIfNull(null, 'Could not find address record', 404);
    }
  }

  static async findAddressByCoordinates(longitude, latitude) {
    const location = await LocationService.findLocation(longitude, latitude, false, true);
    if (location) return location.address;
  }

  static async findOrCreateAddress(address, location) {
    let theLocation = {};
    if (location) {
      theLocation = await LocationService.createLocation(
        location.longitude, location.latitude
      );
    }

    const [addressData] = await Address.findOrCreate({
      where: {
        address: { [Op.iLike]: `${address}%` }
      },
      defaults: {
        address,
        locationId: theLocation.id
      }
    });

    return {
      ...addressData.dataValues,
      longitude: theLocation.longitude,
      latitude: theLocation.latitude
    };
  }

  /**
   * @description Saves the new address and location record
   * @param  {number} longitude The longitude of the location
   * @param  {number} latitude The latitude of the location
   * @param  {string} address The address of thr location
   * @returns {object} The newly created address and location info
   */
  static async createNewAddress(longitude, latitude, address) {
    try {
      const location = await LocationService.createLocation(longitude, latitude);
      const [addressData] = await Address.findOrCreate({
        where: {
          address: { [Op.iLike]: `${address}%` }
        },
        defaults: {
          address,
          locationId: location.id
        }
      });
      const { _options: { isNewRecord } } = addressData;
      const newAddressData = {
        id: addressData.dataValues.id,
        address: addressData.dataValues.address,
        longitude: location.longitude,
        latitude: location.latitude,
        isNewAddress: isNewRecord
      };
      return newAddressData;
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.throwErrorIfNull(null, 'Could not create address', 500);
    }
  }

  /**
   * @description updates address and location record
   * @param  {string} address The address to be updated
   * @param  {string} newAddress The new address
   * @param  {number} newLongitude The new longitude of the location
   * @param  {number} newLatitude The new latitude of the location
   * @returns {object} The newly created address and location info
   */
  static async updateAddress(address, newLongitude, newLatitude, newAddress) {
    try {
      const addressData = await AddressService.findAddress(address);
      const modAddress = addressData;

      modAddress.address = (newAddress || addressData.dataValues.address).trim();
      modAddress.location.longitude = newLongitude || modAddress.location.dataValues.longitude;
      modAddress.location.latitude = newLatitude || modAddress.location.dataValues.latitude;
      await modAddress.save();

      const updatedAddressData = { ...modAddress.dataValues, ...modAddress.location.dataValues };
      return updatedAddressData;
    } catch (error) {
      bugsnagHelper.log(error);
      HttpError.throwErrorIfNull(
        null,
        'Could not update address record',
        500
      );
    }
  }

  /**
   * @description Get's paginated address records from db
   * @param  {number} size The size of a single page
   * @param  {number} page The page number
   * @returns {object} An array of addresses
   */
  static async getAddressesFromDB(size, page) {
    return Address.findAndCountAll({
      raw: true,
      limit: size,
      offset: size * (page - 1),
      order: [['id', 'DESC']],
      include: [{ model: Location, as: 'location' }]
    });
  }

  /**
   * @description Get's coordinates records from db using address
   * @param  {string} address The address of the location
   * @returns {object} An array of addresses
   */
  static async findCoordinatesByAddress(address) {
    const addressCoords = await Address.findOne({
      where: {
        address: { [Op.iLike]: `${address}%` }
      },
      include: [{
        model: Location,
        as: 'location'
      }]
    });
    return RemoveDataValues.removeDataValues(addressCoords);
  }
}

export default AddressService;
