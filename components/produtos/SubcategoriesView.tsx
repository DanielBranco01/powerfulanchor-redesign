"use client";

import { CATEGORIES, subcategoriesOf } from "@/lib/catalogue";
import { useCatalogueData } from "@/lib/catalogue-store";
import { useCatalogue } from "./context";
import SvgIcon from "./SvgIcon";

export default function SubcategoriesView() {
  const { filters, showCats, enterSubcat } = useCatalogue();
  const { products, ready } = useCatalogueData();
  const cat = CATEGORIES.find((c) => c.key === filters.cat);

  if (!cat) return null;

  const subcats = subcategoriesOf(products, cat.key);

  return (
    <>
      <section className="head">
        <div className="wrap">
          <div className="crumbs">
            <a onClick={showCats}>Produtos</a>
            <span className="sep">/</span>
            <span className="cur">{cat.key}</span>
          </div>
          <h1>{cat.key}</h1>
          <p>{cat.desc}</p>
        </div>
      </section>
      <section className="cats">
        <div className="wrap">
          {!ready && <p style={{ marginBottom: 16 }}>A carregar…</p>}
          <div className="cat-grid">
            {subcats.map((s) => (
              <div
                key={s.name}
                className={`catcard ${cat.cls}`}
                onClick={() => enterSubcat(s.name)}
              >
                <div className="cico">
                  <SvgIcon inner={cat.icon} />
                </div>
                <h3>{s.name}</h3>
                <div className="go">
                  <span className="cnt">{s.count} produtos</span>
                  <span className="arrow">Ver produtos →</span>
                </div>
              </div>
            ))}
          </div>
          <div className="allbtn">
            <button onClick={() => enterSubcat("all")}>
              Ver todos os produtos desta categoria →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
