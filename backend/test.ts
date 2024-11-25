const { ethers } = require('ethers');
import moment from 'moment';
async function abc(s: string) {
  console.log(moment(s).unix());
}

abc('2018-11-24T10:33:48.000Z')
