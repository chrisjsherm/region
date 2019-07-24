const assert = require('chai').assert;
const Region = require('./Region');

describe('Region class', () => {
  it('should throw when a non-string name is passed to its constructor', () => {
    assert.throws(() => {
      new Region(true, new Set());
    }, TypeError);

    assert.throws(() => {
      new Region(123, new Set());
    }, TypeError);
  });

  it('should throw when a non-Array region list is passed to the constructor', () => {
    assert.throws(() => {
      new Region('New River Valley', '12222');
    });
  });

  it('should pass when a valid Region is instantiated', () => {
    assert.strictEqual(
      new Region(
        'New River Valley',
        new Set(['24068', '24073', '24061', '24060', '24141', '24142', '24143'])
      ).name,
      'New River Valley'
    );
  });
});

describe('Region.getMatchingRegion static method', () => {
  it('should throw when a non-object is passed for obj to getMatchingRegion', () => {
    assert.throws(() => {
      Region.getMatchingRegion('New River Valley', 'zipCode', []);
    });
  });

  it('should throw when a non-string is passed for zipCodeProperty to getMatchingRegion', () => {
    assert.throws(() => {
      Region.getMatchingRegion({}, 12345, []);
    });

    try {
      Region.getMatchingRegion({}, 12345, []);
    } catch (e) {
      assert.match(e.message, new RegExp(/zipCodeProperty must be a string.*/));
    }
  });

  it('should throw if the obj parameter does not have a property matching ' +
    'the zipCodeProperty', () => {
      try {
        Region.getMatchingRegion(
          { name: 'New River Valley' },
          'zipCode',
          []
        );
      } catch (e) {
        assert.match(e.message, new RegExp(/obj must have a property named.*/));
      }
    });

  it('should throw if regionsToMatch is not an array', () => {
    try {
      Region.getMatchingRegion(
        { zipCode: '24060' },
        'zipCode',
        'New River Valley',
      );
    } catch (e) {
      assert.match(e.message, new RegExp(/regionsToMatch must be an Array.*/));
    }
  });

  it('should return a matching region', () => {
    const matchingRegion1 = new Region(
      'New River Valley', new Set(['24060', '24061', '24073']));

    assert.deepStrictEqual(Region.getMatchingRegion(
      { zipCode: '24060' },
      'zipCode',
      [matchingRegion1]
    ), matchingRegion1);

    const matchingRegion2 = new Region(
      'Northern Virginia', new Set(['22201', '22152'])
    );

    assert.deepStrictEqual(Region.getMatchingRegion(
      { zipCode: '22152' },
      'zipCode',
      [matchingRegion1, matchingRegion2]
    ), matchingRegion2);
  });
});
