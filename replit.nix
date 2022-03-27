{ pkgs }: {
    deps = [
        pkgs.nodejs-17_x
        pkgs.yarn
        pkgs.nodePackages.typescript
        pkgs.nodePackages.typescript-language-server
    ];
}