var COFFEE = COFFEE || {};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
};

COFFEE.initShared = function(drinkTypes, strengthTypes, milkTypes) {
  var DRINK_TYPES = drinkTypes;
  var STRENGTH_TYPES = strengthTypes;
  var MILK_TYPES = milkTypes;

  return {
    DRINK_TYPES : DRINK_TYPES
    , MILK_TYPES : MILK_TYPES
    , STRENGTH_TYPES : STRENGTH_TYPES
  };
}