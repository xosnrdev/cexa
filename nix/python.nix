{ common ? import ./common.nix { } }:

let
  pythonEnv = common.pkgs.python3Minimal;

  errorHandlerScriptDir = common.pkgs.runCommand "error-handler-dir" { } ''
    mkdir $out
    cp ${common.pkgs.writeScript "error-handler.py" (builtins.readFile ./utils/error-handler.py)} $out/error-handler.py
  '';
in
common.buildImage {
  name = "cexa/python";
  tag = "1.0.0";
  copyToRoot = [ pythonEnv errorHandlerScriptDir ];
  config = { };
}
