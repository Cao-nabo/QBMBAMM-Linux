#!/usr/bin/env bash
# Desktop launcher entry point for the Linux fork of QBMBAMM.
# Builds (fast incremental no-op if unchanged) then runs the already-built dll directly,
# so a double-click behaves like launching a normal app rather than opening a terminal.
set -euo pipefail

export PATH="$HOME/.dotnet:$PATH"
export DOTNET_ROOT="$HOME/.dotnet"

cd "$(dirname "$0")/src/QBModsBrowser.Server"
dotnet build --nologo -v quiet
exec dotnet bin/Debug/net10.0/QBMBAMM.dll
