import { useMemo, useRef, useState } from "react";

function getThreadColor(tone) {
  switch (tone) {
    case "cream":
      return "rgba(238, 231, 217, 0.98)";
    case "charcoal":
      return "rgba(52, 58, 65, 0.92)";
    case "indigo":
    default:
      return "rgba(221, 229, 241, 0.96)";
  }
}

function getGuideColor(tone) {
  switch (tone) {
    case "cream":
      return "rgba(205, 189, 157, 0.2)";
    case "charcoal":
      return "rgba(15, 23, 42, 0.18)";
    case "indigo":
    default:
      return "rgba(62, 88, 121, 0.18)";
  }
}

function getHardwareColor(tone) {
  switch (tone) {
    case "matte-black":
      return "rgba(42, 48, 56, 0.92)";
    case "nickel":
      return "rgba(206, 214, 223, 0.94)";
    case "antique-brass":
    default:
      return "rgba(181, 138, 79, 0.95)";
  }
}

function getFrame(placement) {
  if (placement.patchShape === "strip") {
    return { width: 120, height: 42, radius: 12 };
  }

  if (placement.patchShape === "panel") {
    return { width: 118, height: 92, radius: 20 };
  }

  return { width: 110, height: 84, radius: 44 };
}

function buildPatternSegments(placement) {
  const { width, height } = getFrame(placement);
  const density = placement.stitchDensity === "dense" ? 8 : 5;
  const left = placement.x - width / 2 + 10;
  const right = placement.x + width / 2 - 10;
  const top = placement.y - height / 2 + 10;
  const bottom = placement.y + height / 2 - 10;
  const cx = placement.x;
  const cy = placement.y;
  const segments = [];

  if (placement.patternType === "diagonal") {
    for (let step = 0; step <= density; step += 1) {
      const offset = (step / density) * (height - 20);
      segments.push({
        type: "line",
        x1: left,
        y1: top + offset,
        x2: right - 12,
        y2: top + offset - 18,
      });
      segments.push({
        type: "line",
        x1: left + 12,
        y1: bottom - offset + 12,
        x2: right,
        y2: bottom - offset - 6,
      });
    }
    return segments;
  }

  if (placement.patternType === "wave") {
    for (let step = 0; step < density; step += 1) {
      const y = top + step * ((bottom - top) / Math.max(1, density - 1));
      segments.push({
        type: "path",
        d: `M ${left} ${y} C ${left + 18} ${y - 10}, ${left + 34} ${y + 10}, ${left + 50} ${y}
            S ${left + 82} ${y - 10}, ${right} ${y}`,
      });
    }
    return segments;
  }

  if (placement.patternType === "ladder") {
    for (let step = 0; step < density; step += 1) {
      const y = top + step * ((bottom - top) / Math.max(1, density - 1));
      segments.push({ type: "line", x1: left, y1: y, x2: right, y2: y });
    }
    for (let step = 0; step < density - 1; step += 1) {
      const x = left + 12 + step * ((right - left - 24) / Math.max(1, density - 2 || 1));
      segments.push({ type: "line", x1: x, y1: top + 8, x2: x, y2: bottom - 8 });
    }
    return segments;
  }

  for (let step = 0; step < density; step += 1) {
    const y = top + step * ((bottom - top) / Math.max(1, density - 1));
    segments.push({ type: "line", x1: left, y1: y, x2: right, y2: y - 2 });
  }
  for (let step = 0; step < density; step += 1) {
    const x = left + step * ((right - left) / Math.max(1, density - 1));
    segments.push({ type: "line", x1: x, y1: top, x2: x + 2, y2: bottom });
  }
  segments.push({ type: "dot", x: cx, y: cy });
  return segments;
}

function PlacementOverlay({ placement, isSelected }) {
  const frame = getFrame(placement);
  const threadColor = getThreadColor(placement.patchTone);
  const guideColor = getGuideColor(placement.patchTone);
  const accentStroke = isSelected ? "rgba(177, 55, 20, 0.9)" : "rgba(255, 255, 255, 0.35)";
  const segments = buildPatternSegments(placement);
  const clipId = `clip-${placement.id}`;

  return (
    <g>
      <defs>
        {placement.patchShape === "oval" ? (
          <clipPath id={clipId}>
            <ellipse cx={placement.x} cy={placement.y} rx={frame.width / 2} ry={frame.height / 2} />
          </clipPath>
        ) : (
          <clipPath id={clipId}>
            <rect
              x={placement.x - frame.width / 2}
              y={placement.y - frame.height / 2}
              width={frame.width}
              height={frame.height}
              rx={frame.radius}
            />
          </clipPath>
        )}
      </defs>

      {placement.patchShape === "oval" ? (
        <ellipse
          cx={placement.x}
          cy={placement.y}
          rx={frame.width / 2}
          ry={frame.height / 2}
          fill={guideColor}
          stroke={accentStroke}
          strokeWidth={isSelected ? "2.5" : "1.3"}
          strokeDasharray={isSelected ? "10 7" : "6 7"}
        />
      ) : (
        <rect
          x={placement.x - frame.width / 2}
          y={placement.y - frame.height / 2}
          width={frame.width}
          height={frame.height}
          rx={frame.radius}
          fill={guideColor}
          stroke={accentStroke}
          strokeWidth={isSelected ? "2.5" : "1.3"}
          strokeDasharray={isSelected ? "10 7" : "6 7"}
        />
      )}

      <g clipPath={`url(#${clipId})`}>
        {segments.map((segment, index) => {
          if (segment.type === "path") {
            return (
              <path
                key={`${placement.id}-path-${index}`}
                d={segment.d}
                fill="none"
                stroke={threadColor}
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeDasharray="11 9"
              />
            );
          }

          if (segment.type === "dot") {
            return (
              <circle
                key={`${placement.id}-dot-${index}`}
                cx={segment.x}
                cy={segment.y}
                r="2.8"
                fill={threadColor}
              />
            );
          }

          return (
            <line
              key={`${placement.id}-line-${index}`}
              x1={segment.x1}
              y1={segment.y1}
              x2={segment.x2}
              y2={segment.y2}
              stroke={threadColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="11 9"
            />
          );
        })}
      </g>
    </g>
  );
}

function HardwareOverlay({ hardware }) {
  if (!hardware || hardware.closureType === "none") {
    return null;
  }

  const color = getHardwareColor(hardware.hardwareTone);
  const centerX = 402;
  const topY = 250;
  const bottomY = 760;
  const buttonCount = hardware.buttonCount ?? 5;

  if (hardware.closureType === "zipper") {
    const toothCount = 18;
    return (
      <g opacity="0.96">
        <line x1={centerX} y1={topY} x2={centerX} y2={bottomY} stroke={color} strokeWidth="4" strokeLinecap="round" />
        <line x1={centerX - 10} y1={topY + 18} x2={centerX - 10} y2={bottomY - 18} stroke={color} strokeWidth="1.6" opacity="0.55" />
        <line x1={centerX + 10} y1={topY + 18} x2={centerX + 10} y2={bottomY - 18} stroke={color} strokeWidth="1.6" opacity="0.55" />
        {Array.from({ length: toothCount }).map((_, index) => {
          const y = topY + 24 + index * ((bottomY - topY - 48) / (toothCount - 1));
          return (
            <g key={`zip-${index}`}>
              <line x1={centerX - 9} y1={y} x2={centerX - 2} y2={y} stroke={color} strokeWidth="1.8" />
              <line x1={centerX + 2} y1={y} x2={centerX + 9} y2={y} stroke={color} strokeWidth="1.8" />
            </g>
          );
        })}
        <rect x={centerX - 8} y={topY + 4} width="16" height="18" rx="3" fill={color} />
      </g>
    );
  }

  return (
    <g opacity="0.96">
      <line
        x1={centerX}
        y1={topY}
        x2={centerX}
        y2={bottomY}
        stroke={color}
        strokeWidth="2.2"
        strokeDasharray="2 10"
        opacity="0.5"
      />
      {Array.from({ length: buttonCount }).map((_, index) => {
        const y = topY + 36 + index * ((bottomY - topY - 72) / Math.max(1, buttonCount - 1));
        return (
          <g key={`button-${index}`}>
            <circle cx={centerX} cy={y} r="9" fill={color} />
            <circle cx={centerX - 2.5} cy={y - 2.5} r="1.1" fill="rgba(255,255,255,0.65)" />
            <circle cx={centerX + 2.5} cy={y - 2.5} r="1.1" fill="rgba(255,255,255,0.65)" />
            <circle cx={centerX - 2.5} cy={y + 2.5} r="1.1" fill="rgba(255,255,255,0.65)" />
            <circle cx={centerX + 2.5} cy={y + 2.5} r="1.1" fill="rgba(255,255,255,0.65)" />
          </g>
        );
      })}
    </g>
  );
}

export default function SashikoCustomizerCanvas({
  imageUrl,
  placements,
  selectedPlacementId,
  onSelectPlacement,
  onCanvasClick,
  onMovePlacement,
  hardware,
  interactive = false,
}) {
  const svgRef = useRef(null);
  const [dragPlacementId, setDragPlacementId] = useState(null);

  const dragLabel = useMemo(
    () => placements.find((placement) => placement.id === dragPlacementId)?.zone ?? null,
    [dragPlacementId, placements]
  );

  const getPoint = (event) => {
    const svg = svgRef.current;

    if (!svg) {
      return null;
    }

    const rect = svg.getBoundingClientRect();
    return {
      x: Math.max(24, Math.min(776, ((event.clientX - rect.left) / rect.width) * 800)),
      y: Math.max(24, Math.min(976, ((event.clientY - rect.top) / rect.height) * 1000)),
    };
  };

  const startDrag = (event, placementId) => {
    if (!interactive) {
      return;
    }

    event.stopPropagation();
    setDragPlacementId(placementId);
    onSelectPlacement?.(placementId);
  };

  const handlePointerMove = (event) => {
    if (!interactive || !dragPlacementId) {
      return;
    }

    const point = getPoint(event);

    if (!point) {
      return;
    }

    onMovePlacement?.(dragPlacementId, point);
  };

  const stopDrag = () => {
    setDragPlacementId(null);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)]">
      {imageUrl ? (
        <div className="relative aspect-[4/5]">
          <img src={imageUrl} alt="Garment customizer" className="h-full w-full object-cover" />
          <svg
            viewBox="0 0 800 1000"
            preserveAspectRatio="none"
            className={`absolute inset-0 h-full w-full ${interactive ? "cursor-crosshair" : ""}`}
            ref={svgRef}
            onClick={interactive ? onCanvasClick : undefined}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrag}
            onPointerLeave={stopDrag}
          >
            <defs>
              <filter id="thread-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.8" floodOpacity="0.18" />
              </filter>
            </defs>

            <HardwareOverlay hardware={hardware} />

            <g style={{ mixBlendMode: "screen" }} filter="url(#thread-shadow)">
              {placements.map((placement) => (
                <g
                  key={placement.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectPlacement?.(placement.id);
                  }}
                  onPointerDown={(event) => startDrag(event, placement.id)}
                >
                  <PlacementOverlay
                    placement={{ ...placement, patternType: placement.patternType ?? "grid" }}
                    isSelected={placement.id === selectedPlacementId}
                  />
                </g>
              ))}
            </g>
          </svg>

          {dragLabel ? (
            <div className="absolute left-4 top-4 rounded-full bg-[rgba(18,22,27,0.82)] px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white">
              Dragging {dragLabel}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex aspect-[4/5] items-center justify-center text-sm text-[var(--muted)]">
          No image
        </div>
      )}
    </div>
  );
}
