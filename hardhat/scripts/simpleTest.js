async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
    const blockNumber = await provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});

