import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/nav-catalogue";

const PORTS_PER_GROUP = 4;

/**
 * A rack patch panel where each labelled port group is a catalogue category.
 * Link LEDs blink on a staggered loop; hovering a group "plugs in" its ports.
 */
export default function PatchPanel() {
  let port = 0;

  return (
    <div className="panel" role="navigation" aria-label="Categorias do catálogo">
      <div className="panel-ear" aria-hidden="true">
        <i />
        <i />
      </div>
      <div className="panel-face">
        {NAV_CATEGORIES.map((cat, g) => (
          <Link
            key={cat.slug}
            href={`/produtos?cat=${encodeURIComponent(cat.key)}`}
            className="pgroup"
          >
            <span className="pg-ports" aria-hidden="true">
              {Array.from({ length: PORTS_PER_GROUP }, () => {
                port += 1;
                return (
                  <span className="port" key={port}>
                    <span className="port-no">{String(port).padStart(2, "0")}</span>
                    <span className="jack">
                      <span className="plug" />
                    </span>
                    <span
                      className="led"
                      style={{ animationDelay: `${((port * 7) % 23) * 0.37}s` }}
                    />
                  </span>
                );
              })}
            </span>
            <span className="pg-label">
              <span className="pg-code">{String(g + 1).padStart(2, "0")}</span>
              <span className="pg-name">{cat.key}</span>
            </span>
            <span className="pg-meta">
              {cat.subcats.length} famílias <span className="arrow">→</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="panel-ear" aria-hidden="true">
        <i />
        <i />
      </div>
    </div>
  );
}
