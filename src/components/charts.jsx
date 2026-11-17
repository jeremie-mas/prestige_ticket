import { useLayoutEffect, useId, useRef, useState } from 'react';
import { useI18n } from '../i18n.jsx';
import { useInView } from '../motion.jsx';

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

function niceScale(maxValue, target = 4) {
  const raw = Math.max(maxValue, 1) / target;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * pow;
  return { step, top: Math.ceil(maxValue / step) * step };
}

const TIP_WIDTH = 172;

export function StackedBars({ rows, series, height = 300, maxBar = 40, caption, formatValue, legend = true }) {
  const { t, fmt } = useI18n();
  const [ref, width] = useWidth();
  const [viewRef, inView] = useInView();
  const [hidden, setHidden] = useState([]);
  const [hover, setHover] = useState(null);
  const lastHover = useRef(0);
  const valueText = formatValue ?? fmt;

  if (hover !== null) lastHover.current = hover;

  const visible = series.filter((s) => !hidden.includes(s.key));
  const totals = rows.map((row) => visible.reduce((sum, s) => sum + (row[s.key] ?? 0), 0));
  const peak = Math.max(...totals);
  const peakIndex = totals.indexOf(peak);
  const { step, top } = niceScale(peak);

  const m = { top: 20, right: 0, bottom: 28, left: 44 };
  const plotW = Math.max(width - m.left - m.right, 0);
  const plotH = height - m.top - m.bottom;
  const groupW = rows.length ? plotW / rows.length : 0;
  const barW = Math.max(8, Math.min(maxBar, groupW * 0.56));
  const y = (v) => m.top + plotH - (v / top) * plotH;
  const baseline = y(0);
  const ticks = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(v);

  const toggle = (key) => {
    setHidden((list) => {
      if (list.includes(key)) return list.filter((k) => k !== key);
      // Au moins une série reste affichée.
      return visible.length > 1 ? [...list, key] : list;
    });
  };

  const tipLeft =
    hover === null
      ? 0
      : m.left + (hover + 1) * groupW - (groupW - barW) / 2 + 8 + TIP_WIDTH <= width
        ? m.left + (hover + 1) * groupW - (groupW - barW) / 2 + 8
        : Math.max(m.left + hover * groupW + (groupW - barW) / 2 - TIP_WIDTH - 8, 0);

  return (
    <div ref={viewRef} className={`bars-wrap${inView ? ' in' : ''}`}>
      {legend && series.length > 1 && (
        <div className="bars-legend">
          {series.map((s) => (
            <button
              type="button"
              key={s.key}
              aria-pressed={!hidden.includes(s.key)}
              aria-label={t('chart.toggle', { name: s.legend ?? s.label })}
              onClick={() => toggle(s.key)}
            >
              <i style={{ background: s.color }} aria-hidden="true" />
              {s.legend ?? s.label}
            </button>
          ))}
        </div>
      )}
      <div className="bars" ref={ref} style={{ height }} onMouseLeave={() => setHover(null)}>
        {width > 0 && (
          <svg width={width} height={height} aria-hidden="true">
            {ticks.map((tick) => (
              <g key={tick}>
                <line x1={m.left} x2={width} y1={y(tick)} y2={y(tick)} className="grid-line" />
                <text x={0} y={y(tick) + 4} className="tick-y">
                  {formatValue ? formatValue(tick) : fmt(tick)}
                </text>
              </g>
            ))}
            <rect
              className="band"
              y={m.top - 8}
              width={Math.max(groupW - 4, 0)}
              height={plotH + 8}
              rx={10}
              style={{
                opacity: hover === null ? 0 : 1,
                transform: `translateX(${m.left + lastHover.current * groupW + 2}px)`,
              }}
            />
            {rows.map((row, g) => {
              const x = m.left + g * groupW + (groupW - barW) / 2;
              let stack = 0;
              return (
                <g key={row.label}>
                  <g className="bar-col" style={{ '--i': g, transformOrigin: `0 ${baseline}px` }}>
                    {series.map((s) => {
                      const isVisible = !hidden.includes(s.key);
                      const value = isVisible ? (row[s.key] ?? 0) : 0;
                      const y1 = y(stack);
                      stack += value;
                      const y2 = y(stack);
                      // Espace de 2 px entre deux segments empilés.
                      const h = isVisible ? Math.max(y1 - y2 - 2, 2) : 0;
                      return (
                        <rect
                          key={s.key}
                          x={x}
                          y={y1 - h}
                          width={barW}
                          height={h}
                          rx={Math.min(4, h / 2)}
                          fill={s.color}
                          style={{ y: y1 - h, height: h, opacity: isVisible ? 1 : 0 }}
                        />
                      );
                    })}
                  </g>
                  {g === peakIndex && hover === null && (
                    <text x={x + barW / 2} y={y(peak) - 8} className="bar-peak">
                      {valueText(peak)}
                    </text>
                  )}
                  <text x={m.left + g * groupW + groupW / 2} y={height - 6} className="tick-x">
                    {row.label}
                  </text>
                  <rect
                    x={m.left + g * groupW}
                    y={0}
                    width={groupW}
                    height={height}
                    fill="transparent"
                    onMouseEnter={() => setHover(g)}
                    onClick={() => setHover(g)}
                  />
                </g>
              );
            })}
          </svg>
        )}
        {hover !== null && width > 0 && (
          <div className="chart-tip" style={{ left: tipLeft }}>
            <strong>{rows[hover].label}</strong>
            {visible.length > 1 &&
              [...visible].reverse().map((s) => (
                <div className="tip-row" key={s.key}>
                  <i className="dot" style={{ background: s.color }} aria-hidden="true" />
                  {s.label}
                  <b>{valueText(rows[hover][s.key] ?? 0)}</b>
                </div>
              ))}
            <div className={`tip-row${visible.length > 1 ? ' tip-total' : ''}`}>
              {t('chart.total')}
              <b>{valueText(totals[hover])}</b>
            </div>
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
    </div>
  );
}

export function Sparkline({ values, label, height = 64 }) {
  const gradient = useId();
  const [ref, inView] = useInView();
  const w = 240;
  const pad = 5;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((v, i) => [
    pad + (i / (values.length - 1)) * (w - pad * 2),
    pad + (1 - (v - min) / Math.max(max - min, 1)) * (height - pad * 2),
  ]);
  const line = points.map(([x, y]) => `${x},${y}`).join(' ');
  const [lastX, lastY] = points[points.length - 1];
  const area = `${pad},${height} ${line} ${lastX},${height}`;
  return (
    <div ref={ref} className={`spark-wrap${inView ? ' in' : ''}`}>
      <svg className="spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" role="img" aria-label={label} style={{ height }}>
        <defs>
          <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#${gradient})`} />
        <polyline points={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="spark-dot" style={{ left: `${(lastX / w) * 100}%`, top: `${(lastY / height) * 100}%` }} aria-hidden="true" />
    </div>
  );
}
