const ConfigService = require('./services/configuration.service');

/**
 * Geographic region.
 */
module.exports = class Region {
  /**
   *
   * @param {string} name Name of the region.
   * @param {Set<string>} zipCodes Set of zip codes.
   */
  constructor(name, zipCodes) {
    validateName(name);
    this.name = name;

    validateZipCodes(zipCodes);
    this.zipCodes = zipCodes;
  }

  /**
   * For a given object with a zip code property, determine if it matches any
   * of a list of Regions. If it does, return the matching Region.
   *
   * @param {Object} obj Object to compare against.
   * @param {string} zipCodeProperty Property on the obj parameter that holds a
   *  zip code value.
   * @param {Array<Region>} regionsToMatch List of Region objects to match against.
   *
   * @returns {Region | null} Matching Region or null if no match.
   *
   * @throws {TypeError} If a parameter's type does not match the type specified
   *  above.
   */
  static getMatchingRegion(obj, zipCodeProperty, regionsToMatch) {
    if (typeof obj !== 'object' || obj === null) {
      throw new TypeError(
        'obj must be a JavaScript object. Invalid value: ' +
          JSON.stringify(obj) +
          '.'
      );
    }

    if (typeof zipCodeProperty !== 'string') {
      throw new TypeError(
        'zipCodeProperty must be a string. Invalid value: ' +
          JSON.stringify(zipCodeProperty) +
          '.'
      );
    }

    if (!obj.hasOwnProperty(zipCodeProperty)) {
      throw new Error(`obj must have a property named ${zipCodeProperty}.`);
    }

    if (typeof obj[zipCodeProperty] !== 'string') {
      throw new TypeError(
        `obj must have a property named ${zipCodeProperty} ` +
          `with a string value`
      );
    }

    if (!ConfigService.regexZipCodePattern.test(obj[zipCodeProperty])) {
      throw new Error(
        'Zip code values must be a string with five digits or ' +
          'five digits with a dash followed by four digits. ' +
          `Invalid value: ${obj[zipCodeProperty]}`
      );
    }

    if (!Array.isArray(regionsToMatch)) {
      throw new TypeError(
        'regionsToMatch must be an Array of Regions. Invalid ' +
          `value: ${JSON.stringify(regionsToMatch)}.`
      );
    }

    for (let i = 0, length = regionsToMatch.length; i < length; i++) {
      if (regionsToMatch[i].zipCodes.has(obj[zipCodeProperty])) {
        return regionsToMatch[i];
      }
    }

    return null;
  }
};

/**
 * Throw an error if the name is invalid.
 *
 * @param {string} name Name of the region to validate.
 *
 * @returns {boolean} True if the name is valid.
 *
 * @throws {TypeError} If the name is not a string.
 */
function validateName(name) {
  if (typeof name !== 'string') {
    throw new TypeError(`Name must be a string. Invalid value: ${name}.`);
  }

  return true;
}

/**
 * Throw an error if the list of zip codes is not valid.
 *
 * param {Set<string>} zipCodes Set of numeric zip codes.
 *
 * @returns {boolean} True if the zip codes are valid.
 *
 * @throws {TypeError} If the zip codes parameter is not a set of numeric
 *  strings.
 * @throws {RangeError} If the zip code is not five characters in length.
 */
function validateZipCodes(zipCodes) {
  if (!(zipCodes instanceof Set)) {
    throw new TypeError(
      'zipCodes must be a Set of numeric strings. ' +
        `Invalid value: ${JSON.stringify(zipCodes)}.`
    );
  }

  zipCodes.forEach(zipCode => {
    const errorMessage =
      'Each zip code must be a numeric string of length five. ' +
      `Invalid value: ${zipCode}.`;

    if (typeof zipCode !== 'string') {
      throw new TypeError(errorMessage);
    }

    const regexNumeric = /[0-9]/;
    if (!regexNumeric.test(zipCode)) {
      throw new TypeError(errorMessage);
    }

    if (zipCode.length !== 5) {
      throw new RangeError(errorMessage);
    }
  });

  return true;
}
