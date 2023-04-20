/**
 * 输入框限制
 * @param val 输入值
 * @param limitLength 输入长度，无限制则为空
 * @param restrictedChinese 是否不允许输入中文，true 允许/false 不允许
 * @param limitingCharacter 是否限制字符
 * @returns {*}
 */
export function inputRestriction(val, limitLength, restrictedChinese, limitingCharacter) {
  let newVal = val
  if (limitLength) {
    if (newVal.length > Number(limitLength)) {
      newVal = newVal.slice(0, Number(limitLength))
    }
  }
  if (restrictedChinese) {
    newVal = newVal.replace(/[^\x00-\xff]/g, '')
  }
  if (limitingCharacter) {
    newVal = newVal.replace(/[^\w]/g, '')
  }
  return newVal
}
