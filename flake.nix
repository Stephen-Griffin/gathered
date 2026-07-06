{
  description = "Gathered development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        dev-db = pkgs.writeShellScriptBin "dev-db" ''
          set -euo pipefail

          APP_DB_NAME="gathered"
          PGDATA="''${PGDATA:-$PWD/.postgres/data}"
          PGHOST="''${PGHOST:-$PWD/.postgres/sockets}"
          PGPORT="''${PGPORT:-54330}"
          PGLOG="$PWD/.postgres/log"
          DATABASE_URL="postgres://localhost:$PGPORT/$APP_DB_NAME"

          usage() {
            cat <<USAGE
          Usage: dev-db <command>

          Commands:
            init     Initialize and start the local Postgres cluster
            start    Start the local Postgres cluster
            stop     Stop the local Postgres cluster
            status   Show local Postgres cluster status
            reset    Stop and remove the local Postgres cluster
            psql     Open psql for $APP_DB_NAME
          USAGE
          }

          case "''${1:-}" in
            init)
              if [ -d "$PGDATA" ]; then
                echo "Postgres cluster is already initialized at $PGDATA."
                exit 0
              fi

              mkdir -p "$PGDATA" "$PGHOST" "$(dirname "$PGLOG")"
              initdb --pgdata="$PGDATA" --auth=trust --no-instructions
              {
                echo "unix_socket_directories = '$PGHOST'"
                echo "port = $PGPORT"
              } >> "$PGDATA/postgresql.conf"
              pg_ctl -D "$PGDATA" -l "$PGLOG" start
              createdb -h "$PGHOST" -p "$PGPORT" "$APP_DB_NAME" 2>/dev/null || true
              echo "Local development Postgres uses trust auth and is intended for this project only."
              echo "DATABASE_URL=$DATABASE_URL"
              ;;
            start)
              mkdir -p "$PGHOST" "$(dirname "$PGLOG")"
              pg_ctl -D "$PGDATA" -l "$PGLOG" start
              ;;
            stop)
              pg_ctl -D "$PGDATA" stop
              ;;
            status)
              pg_ctl -D "$PGDATA" status
              ;;
            reset)
              pg_ctl -D "$PGDATA" stop >/dev/null 2>&1 || true
              rm -rf "$PGDATA" "$PGHOST"
              echo "Local Postgres cluster removed."
              ;;
            psql)
              psql -h "$PGHOST" -p "$PGPORT" "$APP_DB_NAME"
              ;;
            *)
              usage
              exit 1
              ;;
          esac
        '';
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.bun
            pkgs.nodejs_24
            pkgs.postgresql_17
            dev-db
          ];

          shellHook = ''
            export NEXT_TELEMETRY_DISABLED=1
          '';
        };
      });
}
