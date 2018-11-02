import { calcOneLoanCommission, calcCommission } from '../libs'

const rates = [
  { min: 0, max: 2500000, rate: 0.02 },
  { min: 2500000, max: 5000000, rate: 0.05 },
  { min: 5000000, max: 999999999, rate: 0.07 },
]

describe('libs', () => {
  describe('calcOneLoanCommission', () => {
    describe('Calculate commission when accumCreditLimit = 0', () => {
      it('Calulate commission when accumCreditLimit and newAccumCreditLimit are in same rate', () => {
        const accumCreditLimit = 0
        const loanCreditLimit = 500
        const commission = calcOneLoanCommission(
          rates,
          accumCreditLimit,
          loanCreditLimit
        )
        const expected = 500 * 0.02
        expect(commission).toBe(expected)
      })
      it('Calulate commission when accumCreditLimit and newAccumCreditLimit are in different rate', () => {
        const accumCreditLimit = 0
        const loanCreditLimit = 2600000
        const commission = calcOneLoanCommission(
          rates,
          accumCreditLimit,
          loanCreditLimit
        )
        const expected = 2500000 * 0.02 + 100000 * 0.05
        expect(commission).toBe(expected)
      })
      it('Calulate commission when accumCreditLimit and newAccumCredlitLimit difference are more than one rate', () => {
        const accumCreditLimit = 0
        const loanCreditLimit = 6000000
        const commission = calcOneLoanCommission(
          rates,
          accumCreditLimit,
          loanCreditLimit
        )
        const expected =
          2500000 * 0.02 +
          (5000000 - 2500000) * 0.05 +
          (6000000 - 5000000) * 0.07
        expect(commission).toBe(expected)
      })
    })
    describe('Calculate commission when accumCreditLimit is not 0', () => {
      it('Calulate commission when accumCreditLimit and newAccumCreditLimit are in same rate', () => {
        const accumCreditLimit = 100
        const loanCreditLimit = 500
        const commission = calcOneLoanCommission(
          rates,
          accumCreditLimit,
          loanCreditLimit
        )
        const expected = 500 * 0.02
        expect(commission).toBe(expected)
      })
      it('Calulate commission when startCreditLimit and endCreditLimit are in different rate', () => {
        const accumCreditLimit = 100
        const loanCreditLimit = 2600000
        const commission = calcOneLoanCommission(
          rates,
          accumCreditLimit,
          loanCreditLimit
        )
        const expected = (2500000 - 100) * 0.02 + (2600100 - 2500000) * 0.05
        expect(commission).toBe(expected)
      })
      it('Calulate commission when startCreditLimit and endCreditLimit difference are more than one rate', () => {
        const accumCreditLimit = 100
        const loanCreditLimit = 6000000
        const commission = calcOneLoanCommission(
          rates,
          accumCreditLimit,
          loanCreditLimit
        )
        const expected =
          (2500000 - 100) * 0.02 +
          (5000000 - 2500000) * 0.05 +
          (6000100 - 5000000) * 0.07
        expect(commission).toBe(expected)
      })
    })
  })
  describe('calcCommission', () => {
    describe('All loans have same commission rate', () => {
      const newLoans = [
        { loanId: '59-04-03-01323', creditLimit: 500000 },
        { loanId: '59-04-03-01324', creditLimit: 500000 },
        { loanId: '59-04-03-01325', creditLimit: 500000 },
      ]
      const expected = {
        rates,
        accumCreditLimit: 1500000,
        accumCommission: 1500000 * 0.02,
        breakdownCommissions: [
          { loanId: '59-04-03-01323', commission: 500000 * 0.02 },
          { loanId: '59-04-03-01324', commission: 500000 * 0.02 },
          { loanId: '59-04-03-01325', commission: 500000 * 0.02 },
        ],
      }
      expect(calcCommission(rates, newLoans)).toEqual(expected)
    })
    describe('Loans have different commission rate', () => {
      const newLoans = [
        { loanId: '59-04-03-01323', creditLimit: 1000000 },
        { loanId: '59-04-03-01324', creditLimit: 1500000 },
        { loanId: '59-04-03-01325', creditLimit: 1000000 },
      ]
      const expected = {
        rates,
        accumCreditLimit: 3500000,
        accumCommission: 2500000 * 0.02 + 1000000 * 0.05,
        breakdownCommissions: [
          { loanId: '59-04-03-01323', commission: 1000000 * 0.02 },
          { loanId: '59-04-03-01324', commission: 1500000 * 0.02 },
          { loanId: '59-04-03-01325', commission: 1000000 * 0.05 },
        ],
      }
      expect(calcCommission(rates, newLoans)).toEqual(expected)
    })
    describe('Some loans have different commission rate within same loan', () => {
      const newLoans = [
        { loanId: '59-04-03-01323', creditLimit: 1000000 },
        { loanId: '59-04-03-01324', creditLimit: 1000000 },
        { loanId: '59-04-03-01325', creditLimit: 1000000 },
      ]
      const expected = {
        rates,
        accumCreditLimit: 3000000,
        accumCommission: 2500000 * 0.02 + 500000 * 0.05,
        breakdownCommissions: [
          { loanId: '59-04-03-01323', commission: 1000000 * 0.02 },
          { loanId: '59-04-03-01324', commission: 1000000 * 0.02 },
          {
            loanId: '59-04-03-01325',
            commission: 500000 * 0.02 + 500000 * 0.05,
          },
        ],
      }
      expect(calcCommission(rates, newLoans)).toEqual(expected)
    })
  })
})
