{ pkgs ? import <nixpkgs> { } }:

let
  commonEnv = [
    "LANG=C.UTF-8"
  ];
in
{
  inherit pkgs;

  buildImage =
    { name
    , tag
    , copyToRoot
    , created ? "now"
    , config ? { }
    }:
    pkgs.dockerTools.buildLayeredImage {
      inherit name tag created;
      contents = [ pkgs.bash pkgs.coreutils ] ++ copyToRoot;
      config = {
        Env = commonEnv;
        inherit config;
      };
    };
}
