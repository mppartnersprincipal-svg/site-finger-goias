#!/usr/bin/env bash
# Lighthouse mobile (4G lento + CPU 4x simulados). uso: lh.sh <caminho> <nome>
cd "$(dirname "$0")/.."
npx --yes lighthouse@latest "http://localhost:3100$1" --form-factor=mobile --only-categories=performance,accessibility,seo,best-practices \
  --output=json --output-path="scripts/media/_out/lh-$2.json" --chrome-flags="--headless=new --no-sandbox" --quiet >/dev/null 2>&1
node -e "
const r=require('./scripts/media/_out/lh-$2.json');const a=r.audits;const m=a.metrics.details.items[0];
const sc=Object.entries(r.categories).map(([k,v])=>k.slice(0,4)+' '+Math.round(v.score*100)).join(' | ');
const mt={};(a['mainthread-work-breakdown'].details.items).forEach(i=>mt[i.groupLabel]=Math.round(i.duration));
console.log('$1'.padEnd(18), sc, '| LCP', (m.largestContentfulPaint/1000).toFixed(2)+'s', 'FCP', (m.firstContentfulPaint/1000).toFixed(2)+'s', 'TBT', Math.round(m.totalBlockingTime)+'ms', 'CLS', a['cumulative-layout-shift'].displayValue, '| obs LCP', m.observedLargestContentfulPaint+'ms', '| style+layout', mt['Style & Layout'], 'script', mt['Script Evaluation'], '|', a['total-byte-weight'].displayValue.replace('Total size was ',''));"
