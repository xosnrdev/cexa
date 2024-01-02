{ common ? import ./common.nix { } }:

let
  pythonEnv = common.pkgs.python3Minimal;

in
common.buildImage {
  name = "cexa/python";
  tag = "1.0.0";
  copyToRoot = [ pythonEnv ];
  config = { };
}
