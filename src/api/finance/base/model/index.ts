export interface ServiceEntry {
  accountBalance: number; // 账户余额
  accountFrozen: number; // 冻结金额
  companyName: string; // 公司名称
  currency: string; // 币种
  objectCode: string; // 结算对象代码
  objectName: string; // 对象名称
  settlementObject: 1 | 2; // 结算对象类型(1客户 2服务商)
}
