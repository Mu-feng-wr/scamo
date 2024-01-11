/**
 * 正则校验封装js
 * 使用：
 * import pattern from "@/utils/pattern";
 * 例子：
 * number: pattern.Integer(true, "请输入数字", 0，100)
 */
//整数
const IntegerRegex = /(^-?[1-9]\d*)|(0{1})$/

//正整数
const IntegerPlusRegex = /^[1-9]\d*|0$/

//小数
const decimalRegex = /^-?([1-9]\d*\.*\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/

//正小数
const decimalPlusRegex = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/

//百分比校验（最多两位小数,不能超过100，不带百分号）
const percentageRegex = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/

//邮箱
const emailRegex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

//手机
const mobileRegex = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/

//身份证
const idCardRegex = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

//英文和数字
const englishNumbersRegex = /^[A-Za-z0-9]+$/

//电话号码
const telephone2Regex = /^((\d{3,4}-)|\d{3.4}-)?\d{7,8}$/
const telephoneRegex = /(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/

//金额校验（不能超过两位小数）
let moneyRegex = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/

//金额校验，支持负数
let moneyNegativeRegex = /^((-?[1-9]{1}\d*)|(-?0{1}))(\.\d{1,2})?$/

let ipRegex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

let portRegex = /^(([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))$/;

//邮编校验
let zipRegex = /^\d{6}$/

//传真
const fexRegex = /^(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?$/


function checkNull(val) {
  return val != undefined && val != null
}

function getrRegex(min, max, regex, msg, extend) {
  let list = [{
    pattern: regex,
    message: msg,
    trigger: "blur",
  }]
  if (checkNull(min) || checkNull(max)) {
    list.push({
      validator: (rules, value, callback) => {
        if (checkNull(max) && value > max) {
          return callback(new Error("超出范围"));
        } else if (checkNull(min) && value < min) {
          return callback(new Error("超出范围"));
        } else {
          return callback();
        }
      },
      trigger: "blur"
    })
  }
  if (typeof extend === "object") {
    extend.forEach(e => {
      list.push(e)
    });
  }
  return list;
}

function addQuired(list, required, msg) {
  if (typeof required == Boolean || required) {
    msg = msg == undefined ? '' : msg
    let obj = {
      required: true,
      message: msg,
      trigger: "blur"
    }
    list.unshift(obj)
  }
}

function Integer(required, msg, min, max, extend) {
  let list = getrRegex(min, max, IntegerRegex, "请输入整数", extend)
  addQuired(list, required, msg)
  return list
}

function IntegerPlus(required, msg, min, max, extend) {
  let list = getrRegex(min, max, IntegerPlusRegex, "请输入正整数", extend)
  addQuired(list, required, msg)
}

function decimal(required, msg, min, max, extend) {
  let list = getrRegex(min, max, decimalRegex, "请输入小数", extend)
  addQuired(list, required, msg)
}

function decimalPlus(required, msg, min, max, extend) {
  let list = getrRegex(min, max, decimalPlusRegex, "请输入正小数", extend)
  addQuired(list, required, msg)
}

function percentage(required, msg, extend) {
  let list = getrRegex(null, null, percentageRegex, "请输入正确的百分数，最多两位小数,不能超过100", extend)
  addQuired(list, required, msg)
}

function email(required, msg, extend) {
  let list = getrRegex(null, null, emailRegex, "请输入正确的邮箱", extend)
  addQuired(list, required, msg)
  return list
}


function mobile(required, msg, extend) {
  let list = getrRegex(null, null, mobileRegex, "请输入正确的手机号", extend)
  addQuired(list, required, msg)
  return list
}

function telephone(required, msg, extend) {
  let list = getrRegex(null, null, telephoneRegex, "请输入正确的电话号码", extend)
  addQuired(list, required, msg)
  return list
}

function money(required, msg, extend) {
  let list = getrRegex(null, null, moneyRegex, "请输入正确的金额，不能超过两位小数", extend)
  addQuired(list, required, msg)
}

function moneyNegative(required, msg, extend) {
  let list = getrRegex(null, null, moneyNegativeRegex, "请输入正确的金额，不能超过两位小数", extend)
  addQuired(list, required, msg)
}

function isZip(required, msg, extend) {
  let list = getrRegex(null, null, zipRegex, "请输入正确的邮编", extend)
  addQuired(list, required, msg)
  return list
}

function CheckSocialCreditCode(Code) {
  var patrn = /^[0-9A-Z]+$/; //18位校验及大写校验
  if (Code.length != 18 || patrn.test(Code) == false) {
    return false;
  } else {
    var Ancode; //统一社会信用代码的每一个值
    var Ancodevalue; //统一社会信用代码每一个值的权重
    var total = 0;
    var weightedfactors = [
      1,
      3,
      9,
      27,
      19,
      26,
      16,
      17,
      20,
      29,
      25,
      13,
      8,
      24,
      10,
      30,
      28
    ]; //加权因子
    var str = "0123456789ABCDEFGHJKLMNPQRTUWXY"; //不用I、O、S、V、Z
    for (var i = 0; i < Code.length - 1; i++) {
      Ancode = Code.substring(i, i + 1);
      Ancodevalue = str.indexOf(Ancode);
      total = total + Ancodevalue * weightedfactors[i]; //权重与加权因子相乘之和
    }
    var logiccheckcode = 31 - (total % 31);
    if (logiccheckcode == 31) {
      logiccheckcode = 0;
    }
    var Str =
      "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
    var Array_Str = Str.split(",");
    logiccheckcode = Array_Str[logiccheckcode];
    var checkcode = Code.substring(17, 18);
    if (logiccheckcode != checkcode) {
      console.log(123);
      return false;
    }
    return true;
  }
}

/**
 * 是否合法IP地址
 * @param value
 * @param callback
 */
function validateIP(rule, value, callback) {
  if (value === '' || typeof value === 'undefined' || value == null) {
    callback(new Error('请输入正确的IP地址'))
  } else {
    if ((!ipRegex.test(value)) && value !== '') {
      callback(new Error('请输入正确的IP地址'))
    } else {
      callback()
    }
  }
}

function validatePort(rule, value, callback) {
  if (value == '') {
    return callback(new Error('请输入端口号'))
  } else if (portRegex.test(value) == false) {
    callback(new Error('请输入正确的端口号'))
  } else {
    callback()
  }
}

function validateTelephone(rule, value, callback) {
  if (!value&&!rule.required) {
    return callback()
  }
  if (!value&&rule.required) {
    return callback(new Error('请输入正确的电话号码'))
  } else if (value && telephone2Regex.test(value) == false && mobileRegex.test(value) == false) {
    callback(new Error('请输入正确的电话号码'))
  } else {
    callback()
  }
}

function validTelephone(rule, value, callback) {
  if (!value&&!rule.required) {
    return callback()
  }
  if (value == ''&&rule.required) {
    return callback(new Error('请输入正确的电话号码'))
  } else if (telephone2Regex.test(value) == false) {
    callback(new Error('请输入正确的电话号码'))
  } else {
    callback()
  }
}

function validateMobile(rule, value, callback) {
  if (value == '') {
    return callback(new Error('请输入正确的手机号码'))
  } else if (mobileRegex.test(value) == false) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}

function validateEmail(rule, value, callback) {
  if (value == '') {
    return callback(new Error('请输入正确的邮箱'))
  } else if (emailRegex.test(value) == false) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}

function validateEmailAndNot(rule, value, callback) {
  if (!value) {
    return callback()
  } else if (emailRegex.test(value) == false) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
// 金额千分位,小数点后保留两位
function rbstateFormatTDTwo(row, column, cellValue) {
  if (cellValue !== null) {
    cellValue = Number(cellValue).toFixed(2);
    cellValue += "";
    if (!cellValue.includes(".")) cellValue += ".";
    return cellValue
      .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ",";
      })
      .replace(/\.$/, "");
  }
}
function rbstateFormatTwo(cellValue) {
  if (cellValue !== null) {
    cellValue = Number(cellValue).toFixed(2);
    cellValue += "";
    if (!cellValue.includes(".")) cellValue += ".";
    return cellValue
      .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ",";
      })
      .replace(/\.$/, "");
  }
}


const all = {
  //正则
  IntegerRegex,
  IntegerPlusRegex,
  decimalRegex,
  decimalPlusRegex,
  percentageRegex,
  emailRegex,
  mobileRegex,
  idCardRegex,
  englishNumbersRegex,
  telephoneRegex,
  moneyRegex,
  moneyNegativeRegex,
  zipRegex,
  ipRegex,
  portRegex,
  fexRegex,

  //校验函数
  Integer,
  IntegerPlus,
  decimal,
  decimalPlus,
  percentage,
  email,
  mobile,
  telephone,
  validateTelephone,
  validTelephone,
  validateMobile,
  validateEmail,
  validateEmailAndNot,
  money,
  moneyNegative,
  isZip,
  //纳税识别号校验
  CheckSocialCreditCode,
  validateIP,
  validatePort,

  rbstateFormatTDTwo,
  rbstateFormatTwo,
}

export {
  //正则
  IntegerRegex,
  IntegerPlusRegex,
  decimalRegex,
  decimalPlusRegex,
  percentageRegex,
  emailRegex,
  mobileRegex,
  idCardRegex,
  englishNumbersRegex,
  telephoneRegex,
  moneyRegex,
  moneyNegativeRegex,
  zipRegex,
  ipRegex,
  portRegex,
  fexRegex,

  //校验函数
  Integer,
  IntegerPlus,
  decimal,
  decimalPlus,
  percentage,
  email,
  mobile,
  telephone,
  validateTelephone,
  validTelephone,
  validateMobile,
  validateEmail,
  validateEmailAndNot,
  money,
  moneyNegative,
  isZip,
  //纳税识别号校验
  CheckSocialCreditCode,
  validateIP,
  validatePort,

}

export default all
