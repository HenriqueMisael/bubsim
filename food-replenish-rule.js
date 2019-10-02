class FoodReplenishRule {

    /*
     *
     * @param {func} shouldReplenish
     * @param {func} replenish
     */
    constructor(shouldReplenish, replenish) {
        this.shouldReplenish = shouldReplenish;
        this.replenish = replenish;
    }
}
