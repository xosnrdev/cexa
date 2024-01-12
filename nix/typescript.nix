{ common ? import ./common.nix { } }:

let
  nodejs = common.pkgs.nodejs;

  tsEnv = common.pkgs.stdenv.mkDerivation {
    name = "typescript-env";
    buildInputs = [ nodejs common.pkgs.nodePackages.typescript ];
    unpackPhase = "true";
    installPhase = ''
      mkdir -p $out
    '';
    shellHook = ''
      export PATH=$PWD/node_modules/.bin:$PATH
    '';
  };

  errorHandlerScriptDir = common.pkgs.runCommand "error-handler-dir" { } ''
    mkdir $out
    cp ${common.pkgs.writeScript "error-handler.ts" (builtins.readFile ./utils/error-handler.ts)} $out/error-handler.ts
  '';

in
common.buildImage {
  name = "cexa/typescript";
  tag = "1.0.0";
  copyToRoot = [ tsEnv errorHandlerScriptDir ];
  config = { };
}
