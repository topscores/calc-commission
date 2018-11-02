const rates = [
  { min: 0, max: 2500000, rate: 0.02 },
  { min: 2500001, max: 5000000, rate: 0.05 },
  { min: 5000001, max: 999999999, rate: 0.07 },
]
const newLoans = [
  { loanId: '59-04-03-01323', creditLimit: 1000000 },
  { loanId: '59-04-03-01324', creditLimit: 1000000 },
  { loanId: '59-04-03-01325', creditLimit: 1000000 },
]

export const calcOneLoanCommission = (
  rates,
  accumCreditLimit,
  loanCreditLimit
) => {
  const newAccumCreditLimit = accumCreditLimit + loanCreditLimit
  return rates.reduce((accumCommission, rate) => {
    const lowerBound = Math.max(accumCreditLimit, rate.min)
    const upperBound = Math.min(newAccumCreditLimit, rate.max)
    const commission = (upperBound - lowerBound) * rate.rate
    return accumCommission + Math.max(0, commission)
  }, 0)
}

export const calcCommission = (rates, newLoans) => {
  const initialState = {
    rates,
    accumCreditLimit: 0,
    accumCommission: 0,
    breakdownCommissions: [],
  }

  const commission = newLoans.reduce((state, loan) => {
    const newCreditLimit = state.accumCreditLimit + loan.creditLimit
    const loanCommission = calcOneLoanCommission(
      state.rates,
      state.accumCreditLimit,
      loan.creditLimit
    )

    return {
      rates: state.rates,
      accumCreditLimit: newCreditLimit,
      accumCommission: state.accumCommission + loanCommission,
      breakdownCommissions: [
        ...state.breakdownCommissions,
        {
          loanId: loan.loanId,
          commission: loanCommission,
        },
      ],
    }
  }, initialState)

  return commission
}
