#!/usr/bin/env bash
# Rebuild + (re)inicia o servidor de produção local na porta 3100, para QA visual e Lighthouse.
set -euo pipefail
cd "$(dirname "$0")/.."
PID=$(netstat -ano 2>/dev/null | grep ":3100 " | grep LISTENING | awk '{print $5}' | head -1 || true)
[ -n "${PID:-}" ] && taskkill //F //PID "$PID" >/dev/null 2>&1 || true
npm run build 2>&1 | grep -E "error|Error|✓ Compiled|○|●|ƒ|Failed" || true
(npx next start -p 3100 > scripts/media/_out/server.log 2>&1 &)
for i in $(seq 1 40); do curl -s -o /dev/null http://localhost:3100/ && break; sleep 1; done
echo "servidor em http://localhost:3100"
