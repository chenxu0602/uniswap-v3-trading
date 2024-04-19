async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
    const poolAddress = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"; // Correct pool address for USDC/ETH 0.3%

    /*
    const poolABI = [
        "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
    ];
    */

    const poolABI = [
        "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
        "function liquidity() external view returns (uint128)",
        "function fee() external view returns (uint24)",
        "function token0() external view returns (address)",
        "function token1() external view returns (address)",
        "function tickSpacing() external view returns (int24)",
        "function maxLiquidityPerTick() external view returns (uint128)"
    ];

    const poolContract = new ethers.Contract(poolAddress, poolABI, provider);

    const [slot0Data, liquidity, fee, token0, token1, tickSpacing, maxLiquidityPerTick] = await Promise.all([
        poolContract.slot0(),
        poolContract.liquidity(),
        poolContract.fee(),
        poolContract.token0(),
        poolContract.token1(),
        poolContract.tickSpacing(),
        poolContract.maxLiquidityPerTick(),
    ]);

    console.log(`Current sqrtPriceX96: ${slot0Data.sqrtPriceX96}`);
    console.log(`Current tick: ${slot0Data.tick}`);
    console.log(`Current liquidity: ${liquidity}`);
    console.log(`Fee: ${fee}`);
    console.log(`Token0: ${token0}`);
    console.log(`Token1: ${token1}`);
    console.log(`Tick Spacing: ${tickSpacing}`);
    console.log(`Max Liquidity per Tick: ${maxLiquidityPerTick}`);

    try {
        const { sqrtPriceX96 } = await poolContract.slot0();
        // Calculate the price of 1 ETH in terms of USDC, the reciprocal of the sqrt formula
        const price = Math.pow(sqrtPriceX96 / Math.pow(2, 96), 2); // This is ETH per USDC directly because of the pool token arrangement
        const ethPerUsdc = 10**12 / price;  // If you need USDC per ETH which is the usual quote
        console.log("Current Price of 1 ETH in terms of USDC:", ethPerUsdc);
    } catch (error) {
        console.error("Error in fetching price:", error);
    }

}

main().catch((error) => {
    console.error("Unhandled Error:", error);
    process.exit(1);
});

