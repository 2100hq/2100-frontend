import { BigNumber } from './index'
export default function percentile(arr = [], p, sorted = false) {
  if (arr.length === 0) return 0
  p = BigNumber(p).div(100)
  if (p.lte(0)) return arr[0]
  if (p.gte(1)) return arr[arr.length - 1]

  if (!sorted) arr.sort(function (a, b) { return BigNumber(a).minus(BigNumber(b)).gt(0) ? 1 : -1 })

  const index = (arr.length - 1) * p
  const lower = Math.floor(index)
  const upper = lower + 1
  const weight = index % 1

  if (upper >= arr.length) return arr[lower]
  return BigNumber(arr[lower]).times(BigNumber(1).minus(weight)).plus(BigNumber(arr[upper]).times(weight)).dp(0, 1)
}