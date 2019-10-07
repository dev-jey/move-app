import RouteRequestService from '../services/RouteRequestService';
import HttpError from '../helpers/errorHandler';
import BugsnagHelper from '../helpers/bugsnagHelper';
import GeneralValidator from './GeneralValidator';

class RouteRequestValidator {
  /**
   * @description This method send all HTTP responses
   * @param  {Object} res The HTTP response object
   * @param  {String} message response message
   */
  static sendResponse(res, message) {
    return res
      .status(400)
      .json({
        success: false,
        message
      });
  }

  static sendResponseWithErrors(res, message, errors) {
    return res.status(400)
      .json({
        success: false,
        message,
        errors
      });
  }

  /**
   * @description This validator ensures that the parameters are of the right type
   * @param  {Object} req The HTTP request object
   * @param  {Object} res The HTTP response object
   * @param  {function} next The next middleware
   */
  static validateParams(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.requestId)) {
      return RouteRequestValidator.sendResponse(res, 400, 'Request Id can only be a number');
    }
    const status = req.body.newOpsStatus.trim();
    if (status !== 'approve' && status !== 'decline') {
      return RouteRequestValidator.sendResponse(res,
        'newOpsStatus can only be \'approve\' or \'decline\'');
    }
    if (!/^[\w,".'\n !-]+$/.test(req.body.comment.trim())) {
      return RouteRequestValidator.sendResponse(res,
        'comment can only contain words and [,."\' -]');
    }
    if (!/^[.\w-']+@andela\.com$/.test(req.body.reviewerEmail.trim())) {
      return RouteRequestValidator.sendResponse(res,
        'reviewerEmail must be an andela email');
    }
    if (!/^[\w-]+\.slack\.com$/.test(req.body.teamUrl.trim())) {
      return RouteRequestValidator.sendResponse(res,
        'teamUrl must be in the format "*.slack.com"');
    }
    if (status === 'approve') {
      return RouteRequestValidator.validateApprovalBody(req, res, next);
    }
    return next();
  }

  static validateApprovalBody(req, res, next) {
    const { takeOff } = req.body;
    if (!/^([0-1]?[0-9]|[2][0-3]):([0-5][0-9])$/.test(takeOff.trim())) {
      return RouteRequestValidator.sendResponse(res,
        'Take off time must be in the right format e.g 11:30');
    }
    return next();
  }

  /**
   * @description This method checks that the required parameters were provided
   * @param  {Object} req The HTTP request object
   * @param  {Object} res The HTTP res object
   * @param  {Function} next The next middleware
   */
  static validateRequestBody(req, res, next) {
    const { comment } = req.body;
    let messages;
    if (comment && comment === 'approve') {
      messages = GeneralValidator.validateReqBody(req.body,
        'newOpsStatus', 'comment', 'reviewerEmail', 'teamUrl', 'routeName', 'takeOff', 'provider');
      RouteRequestValidator.checkMissingProperties(messages, res, next);
    } else {
      messages = GeneralValidator.validateReqBody(req.body,
        'newOpsStatus', 'comment', 'reviewerEmail', 'teamUrl');
      RouteRequestValidator.checkMissingProperties(messages, res, next);
    }
  }

  /**
   * @description This method checks for error messages from the general validator
   * @param  {array} messages The array containing error messages
   * @param  {Object} res The response object
   */
  static checkMissingProperties(messages, res, next) {
    if (messages.length > 0) {
      return RouteRequestValidator.sendResponseWithErrors(res,
        'Some properties are missing', messages);
    }
    next();
  }

  /**
   * @description This validator checks to ensure that the route request status can be modified
   * @param  {Object} req The request object
   * @param  {Object} res The response object
   * @param  {function} next The next middleware
   */
  static async validateRouteStatus(req, res, next) {
    const { requestId } = req.params;

    try {
      const { status } = await RouteRequestService.getRouteRequest(requestId);

      if (status === 'Approved' || status === 'Declined') {
        HttpError.throwErrorIfNull(
          null,
          `This request has already been ${status.toLowerCase()}`,
          409
        );
      }

      if (status !== 'Confirmed') {
        HttpError.throwErrorIfNull(
          null,
          'This request needs to be confirmed by the manager first',
          403
        );
      }

      return next();
    } catch (error) {
      BugsnagHelper.log(error);
      HttpError.sendErrorResponse(error, res);
    }
  }
}

export default RouteRequestValidator;
