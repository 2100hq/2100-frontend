import { get } from 'lodash'

export default function Selectors (state) {
  const controller = {}
  controller.contract = get(state, 'contracts.controller')
  controller.walletPath = [
    'private',
    'myWallets',
    'available',
    (controller.contract || {}).address
  ]
  controller.wallet = get(state, controller.walletPath, {})

  const dai = {}
  dai.contract = get(state, 'contracts.dai')
  dai.walletPath = [
    'private',
    'myWallets',
    'available',
    (dai.contract || {}).address
  ]
  dai.wallet = get(state, dai.walletPath, {})

  return {
    controller,
    dai
  }
}
