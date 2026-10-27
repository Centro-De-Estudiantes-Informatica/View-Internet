import type { components } from "./schema"

type Schemas = components["schemas"]

export type Profile = Schemas["ProfileDto"]
export type SessionDto = Schemas["SessionDto"]
export type UserListItem = Schemas["UserListItemDto"]
export type UserPage = Schemas["UserPageDto"]
export type Payment = Schemas["PaymentDto"]
export type PaymentPage = Schemas["PaymentPageDto"]
export type BillingCurrent = Schemas["BillingCurrentDto"]
export type CurrentRate = Schemas["CurrentRateDto"]
export type Rate = Schemas["RateDto"]
export type MyStatus = Schemas["MyStatusDto"]
export type PeriodBalance = Schemas["PeriodBalanceDto"]
export type Summary = Schemas["SummaryDto"]
export type MonthlyPoint = Schemas["MonthlyPointDto"]
export type RecentPayment = Schemas["RecentPaymentDto"]

export type PeriodStatus = PeriodBalance["status"]
export type PaymentStatus = Payment["status"]
export type UserRole = Profile["role"]
