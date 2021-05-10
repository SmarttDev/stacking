// const dai = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"; //artifacts.require("Dai");
const Dai = artifacts.require("Dai");
const Stacking = artifacts.require("Stacking");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(Dai).then(() =>
    deployer.deploy(Stacking, Dai.address)
  );
};
