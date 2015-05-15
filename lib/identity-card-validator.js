var _ = require('underscore'),
  weightingFactors = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1],
  checkCode = [1,0,'X',9,8,7,6,5,4,3,2];

function sumMasterNumber(identityCard) {
  return _.reduce(identityCard.substr(0, 17).split(''), function(memo, value, index) {
    var currentVal = value.toUpperCase() === 'X' ? 10 : parseInt(value);
    return memo + currentVal * weightingFactors[index];
  }, 0);
}

var identityCardValidator = {
  validate: function(identityCard) {
    if (!identityCard || !_.isString(identityCard) || identityCard.length !== 15 && identityCard.length !== 18) {
      return false;
    }

    var regex = /^(\d{6})(\d{8})(\d{3})(\d|[Xx])$/; 
    if (identityCard.length === 15) {
      identityCard = identityCard.substr(0, 6) + '19' + identityCard.substr(6, 9);
      checkSum15 = sumMasterNumber(identityCard) % 11;
      identityCard += checkCode[checkSum15];
    }

    var parsedId = _(['origin', 'zone', 'birthday', 'sequenceNumber', 'checkSum']).object(identityCard.match(regex));
    var birthDate = _(['origin', 'year', 'month', 'day']).object(parsedId.birthday.match(/^(\d{4})(\d{2})(\d{2})$/));
    if (birthDate.year > (new Date()).getFullYear() || birthDate.year <= 1880) {
      return false;
    } else if (parseInt(birthDate.month, 10) > 12 || parseInt(birthDate.month, 10) < 1) {
      return false;
    } else if (parseInt(birthDate.day, 10) > 31 || parseInt(birthDate.day, 10) < 1) {
      return false;
    }

    var sum = sumMasterNumber(identityCard);

    return parsedId.checkSum.toUpperCase() === checkCode[sum % 11].toString();
  }
};

module.exports = identityCardValidator;
