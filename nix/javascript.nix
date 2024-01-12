{ common ? import ./common.nix { } }:

let

  nodejs = common.pkgs.nodejs;

  jsEnv = nodejs;

  errorHandlerScriptDir = common.pkgs.runCommand "error-handler-dir" { } ''
    mkdir $out
    cp ${common.pkgs.writeScript "error-handler.js" (builtins.readFile ./utils/error-handler.js)} $out/error-handler.js
  '';

in
common.buildImage {
  name = "cexa/javascript";
  tag = "1.0.0";
  copyToRoot = [ jsEnv errorHandlerScriptDir ];
  config = { };
}
