{
  description = "kkhys/me development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    let
      forAllSystems = nixpkgs.lib.genAttrs [
        "aarch64-darwin"
        "x86_64-darwin"
        "x86_64-linux"
        "aarch64-linux"
      ];
    in
    {
      formatter = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        pkgs.writeShellApplication {
          name = "fmt";
          runtimeInputs = [
            pkgs.nixfmt
            pkgs.git
          ];
          # `nix fmt` with no args formats every git-tracked .nix file,
          # avoiding the stray flake.nix files under node_modules / .direnv.
          text = ''
            if [ "$#" -gt 0 ]; then
              nixfmt "$@"
              exit 0
            fi
            readarray -t files < <(git ls-files '*.nix')
            if [ "''${#files[@]}" -gt 0 ]; then
              nixfmt "''${files[@]}"
            fi
          '';
        }
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.nodejs_24
              pkgs.pnpm
              pkgs.bun
              pkgs.ffmpeg
              pkgs.git
            ];

            shellHook = ''
              [ ! -d node_modules ] && pnpm install
            '';
          };
        }
      );
    };
}
