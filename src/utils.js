export function findStake({ user, asset }) {
    return (user.stakes.find(a => a.username === asset.username) || { amount: 0 }).amount
}