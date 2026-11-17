import { useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';

function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    setWidth(ref.current.clientWidth);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

export function ChartLegend({ items }) {
  return (
    <ul className="chart-legend">
      {items.map((item) => (
        <li key={item.key}>
          <i style={{ background: item.color }} aria-hidden="true" />
          {item.legend ?? item.label}
        </li>
      ))}
    </ul>
  );
}

const TOOLTIP_WIDTH = 104;

export function GroupedBars({
  rows,
  series,
  max,
  step,
  defaultActive = null,
  height = 332,
  maxBar = 10,
  caption,
  formatValue,
  tooltipLabel,
}) {
  const { t, fmt } = useI18n();
  const [ref, width] = useWidth();
  const [active, setActive] = useState(defaultActive);
  const [hovering, setHovering] = useState(false);

  const valueText = formatValue ?? ((v) => t('chart.tickets', { n: fmt(v) }));
  const labelText = tooltipLabel ?? ((s) => `${t('chart.sold')} · ${s.label}`);

  const m = { top: 14, right: 4, bottom: 32, left: 42 };
  const plotW = Math.max(width - m.left - m.right, 0);
  const plotH = height - m.top - m.bottom;
  const y = (v) => m.top + plotH - (v / max) * plotH;
  const groupW = rows.length ? plotW / rows.length : 0;
  const gap = 2;
  const barW = Math.max(4, Math.min(maxBar, (groupW * 0.72) / series.length - gap));
  const clusterW = series.length * barW + (series.length - 1) * gap;
  const ticks = [];
  for (let v = step; v <= max; v += step) ticks.push(v);

  const barX = (groupIndex, seriesIndex) =>
    m.left + groupIndex * groupW + (groupW - clusterW) / 2 + seriesIndex * (barW + gap);

  let tip = null;
  if (active && width > 0) {
    const seriesIndex = series.findIndex((s) => s.key === active.key);
    const row = rows[active.group];
    if (row && seriesIndex >= 0) {
      const value = row[active.key];
      const x = barX(active.group, seriesIndex);
      tip = {
        value,
        lineY: y(value),
        // Placée à côté de la barre pour ne pas masquer celle qui est survolée.
        left: x - TOOLTIP_WIDTH - 6 >= 0 ? x - TOOLTIP_WIDTH - 6 : Math.min(x + barW + 6, width - TOOLTIP_WIDTH),
        top: Math.max(y(value) - 56, 0),
        label: labelText(series[seriesIndex], row),
      };
    }
  }

  return (
    <div className="bars" ref={ref} style={{ height }} onMouseLeave={() => setHovering(false)}>
      {width > 0 && (
        <svg width={width} height={height} aria-hidden="true">
          {ticks.map((tick) => (
            <text key={tick} x={0} y={y(tick) + 4} className="tick-y">
              {fmt(tick)}
            </text>
          ))}
          {tip && <line x1={m.left} x2={width - m.right} y1={tip.lineY} y2={tip.lineY} className="hover-line" />}
          {rows.map((row, g) => (
            <g key={row.label}>
              {series.map((s, i) => {
                const h = Math.max(((row[s.key] ?? 0) / max) * plotH, barW);
                const isActive = active?.group === g && active?.key === s.key;
                return (
                  <rect
                    key={s.key}
                    x={barX(g, i)}
                    y={m.top + plotH - h}
                    width={barW}
                    height={h}
                    rx={Math.min(barW / 2, 5)}
                    fill={s.color}
                    className="bar"
                    opacity={hovering && !isActive ? 0.45 : 1}
                  />
                );
              })}
              {series.map((s, i) => (
                <rect
                  key={`${s.key}-hit`}
                  x={i === 0 ? m.left + g * groupW : barX(g, i) - gap / 2}
                  y={m.top}
                  width={
                    series.length === 1
                      ? groupW
                      : i === 0
                        ? barX(g, 0) + barW + gap / 2 - (m.left + g * groupW)
                        : i === series.length - 1
                          ? m.left + (g + 1) * groupW - (barX(g, i) - gap / 2)
                          : barW + gap
                  }
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => {
                    setActive({ group: g, key: s.key });
                    setHovering(true);
                  }}
                  onClick={() => setActive({ group: g, key: s.key })}
                />
              ))}
              <text x={m.left + g * groupW + groupW / 2} y={height - 8} className="tick-x">
                {row.label}
              </text>
            </g>
          ))}
        </svg>
      )}
      {tip && (
        <div className="chart-tip" style={{ left: tip.left, top: tip.top, width: TOOLTIP_WIDTH }}>
          <span>{tip.label}</span>
          <strong>{valueText(tip.value)}</strong>
        </div>
      )}
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th>{t('chart.colPeriod')}</th>
            {series.map((s) => (
              <th key={s.key}>{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              {series.map((s) => (
                <td key={s.key}>{row[s.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const point = (cx, cy, r, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

function segmentPath(cx, cy, outer, inner, start, end, gapPx) {
  const outerPad = ((gapPx / 2 / outer) * 180) / Math.PI;
  const innerPad = ((gapPx / 2 / inner) * 180) / Math.PI;
  const [ox0, oy0] = point(cx, cy, outer, start + outerPad);
  const [ox1, oy1] = point(cx, cy, outer, end - outerPad);
  const [ix1, iy1] = point(cx, cy, inner, end - innerPad);
  const [ix0, iy0] = point(cx, cy, inner, start + innerPad);
  const large = end - start > 180 ? 1 : 0;
  return `M${ox0} ${oy0}A${outer} ${outer} 0 ${large} 1 ${ox1} ${oy1}L${ix1} ${iy1}A${inner} ${inner} 0 ${large} 0 ${ix0} ${iy0}Z`;
}

const LEGEND_ORDER = ['vip', 'gold', 'festival', 'available'];

export function Donut({ segments, center, defaultKey, tooltipAngle = {} }) {
  const { t, fmt } = useI18n();
  const [activeKey, setActiveKey] = useState(defaultKey);
  const [hovering, setHovering] = useState(false);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const size = 300;
  const c = size / 2;
  const outer = 140;
  const inner = 76;

  let cursor = 0;
  const arcs = segments.map((s) => {
    const sweep = (s.value / total) * 360;
    const arc = { ...s, start: cursor, end: cursor + sweep };
    cursor += sweep;
    return arc;
  });
  const active = arcs.find((a) => a.key === activeKey) ?? arcs[arcs.length - 1];
  const angle = tooltipAngle[active.key] ?? (active.start + active.end) / 2;
  const [tx, ty] = point(c, c, outer - 4, angle);

  return (
    <div className="donut-layout">
      <div className="donut" onMouseLeave={() => setHovering(false)}>
        <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(', ')}>
          {arcs.map((a) => (
            <path
              key={a.key}
              d={segmentPath(c, c, outer - 2, inner + 2, a.start, a.end, 7)}
              fill={a.color}
              stroke={a.color}
              strokeWidth="4"
              strokeLinejoin="round"
              className="donut-seg"
              opacity={hovering && a.key !== activeKey ? 0.5 : 1}
              style={{ transform: a.key === activeKey && hovering ? 'scale(1.03)' : 'none' }}
              onMouseEnter={() => {
                setActiveKey(a.key);
                setHovering(true);
              }}
              onClick={() => setActiveKey(a.key)}
            />
          ))}
        </svg>
        <div className="donut-center">{center}</div>
        <div className="donut-tip" style={{ left: `${(tx / size) * 100}%`, top: `${(ty / size) * 100}%` }}>
          <span>{active.state}</span>
          <strong>{t('chart.tickets', { n: fmt(active.value) })}</strong>
        </div>
      </div>
      <ul className="donut-legend">
        {[...arcs]
          .sort((a, b) => LEGEND_ORDER.indexOf(a.key) - LEGEND_ORDER.indexOf(b.key))
          .map((a) => (
            <li
              key={a.key}
              onMouseEnter={() => {
                setActiveKey(a.key);
                setHovering(true);
              }}
              onMouseLeave={() => setHovering(false)}
            >
              <i style={{ background: a.color }} aria-hidden="true" />
              {a.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
