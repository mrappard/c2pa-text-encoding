{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    common-nix = {
      url = "github:vaultie/common-nix";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        flake-utils.follows = "flake-utils";
      };
    };
  };

  outputs =
    {
      nixpkgs,
      common-nix,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        commonLib = common-nix.lib.${system};

        src = commonLib.mkSrc {
          root = ./.;
        };

        pkg =
          {
            cairo,
            giflib,
            lib,
            pango,
            pixman,
            pkg-config,
            stdenv,

          }:
          commonLib.buildNextJsPackage {
            inherit src;

            buildInputs = [
              (cairo.override { x11Support = false; })
              pango
              pixman
            ]
            ++ lib.optional stdenv.hostPlatform.isDarwin giflib;

            nativeBuildInputs = [ pkg-config ];

          };

        default = pkgs.callPackage pkg { };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs
            pkgs.biome
          ];
        };

        packages = {
          # This is what `nix build` looks for:
          default = default;
          # Passthrough postInstall for easier usage.
          inherit (common-nix.packages.${system}) postInstall;


          docker = commonLib.buildDockerImage {
            package = default;
          };
        };

        formatter = pkgs.nixfmt-tree;
      }
    );
}
