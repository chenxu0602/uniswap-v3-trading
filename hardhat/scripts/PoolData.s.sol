// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV3Pool {
    function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked);
    function liquidity() external view returns (uint128);
    function fee() external view returns (uint24);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function tickSpacing() external view returns (int24);
    function maxLiquidityPerTick() external view returns (uint128);
}

contract PoolData is Script {
    function run() public {
        uint256 mainnetFork;
        uint256 sepoliaFork;

        string memory MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");
        string memory SEPOLIA_RPC_URL = vm.envString("SEPOLIA_RPC_URL");

        mainnetFork = vm.createFork(MAINNET_RPC_URL);
        sepoliaFork = vm.createFork(SEPOLIA_RPC_URL);

        vm.selectFork(mainnetFork);

        vm.startBroadcast();

        // address poolAddress = 0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8; // USDC/ETH 0.3% pool
        address poolAddress = 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8; // Correct checksum

        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);

        (uint160 sqrtPriceX96, int24 tick, , , , , ) = pool.slot0();
        uint128 liquidity = pool.liquidity();
        uint24 fee = pool.fee();
        address token0 = pool.token0();
        address token1 = pool.token1();
        int24 tickSpacing = pool.tickSpacing();
        uint128 maxLiquidityPerTick = pool.maxLiquidityPerTick();

        console2.log("Current sqrtPriceX96:", sqrtPriceX96);
        console2.log("Current tick:", tick);
        console2.log("Current liquidity:", liquidity);
        console2.log("Fee:", fee);
        console2.log("Token0:", token0);
        console2.log("Token1:", token1);
        console2.log("Tick Spacing:", tickSpacing);
        console2.log("Max Liquidity per Tick:", maxLiquidityPerTick);

        // Calculate the price of 1 ETH in terms of USDC
        uint256 price = uint256(sqrtPriceX96) * uint256(sqrtPriceX96) >> (96 * 2);
        uint256 ethPerUsdc = 1e12 / price;  // Adjust for precision, USDC per ETH
        console2.log("Current Price of 1 ETH in terms of USDC:", ethPerUsdc);

        vm.stopBroadcast();
    }
}

