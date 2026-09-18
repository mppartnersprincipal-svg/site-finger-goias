#!/usr/bin/env bash
# Lighthouse mobile com throttling APLICADO (DevTools): 4G lento (1,6 Mbps, RTT 150 ms) + CPU 4x.
# Mais fiel que a simulação em localhost, onde a latência zero distorce o grafo de dependências.
cd "$(dirname "$0")/.."
npx --yes lighthouse@latest "http://localhost:3100$1" --form-factor=mobile --throttling-method=devtools --only-categories=performance \
  --output=json --output-path="scripts/media/_out/lhr-$2.json" --chrome-flags="--headless=new --no-sandbox" --quiet >/dev/null 2>&1
node -e "
const r=require('./scripts/media/_out/lhr-$2.json');const a=r.audits;
const bd=(a['lcp-breakdown-insight']?.details?.items?.[0]?.items||[]).map(i=>i.subpart.replace('timeToFirstByte','ttfb').replace('resourceLoad','res').replace('elementRender','render')+' '+Math.round(i.duration)).join(' · ');
console.log('$1'.padEnd(16),'perf',Math.round(r.categories.performance.score*100),'| LCP',a['largest-contentful-paint'].displayValue,'FCP',a['first-contentful-paint'].displayValue,'TBT',a['total-blocking-time'].displayValue,'CLS',a['cumulative-layout-shift'].displayValue,'|',bd);"
