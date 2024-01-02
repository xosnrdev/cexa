{ common ? import ./common.nix { } }:

let

  nodejs = common.pkgs.nodejs;

  jsEnv = nodejs;

in
common.buildImage {
  name = "cexa/javascript";
  tag = "1.0.0";
  copyToRoot = [ jsEnv ];
  config = { };
}
