import Link from "next/link";
import { hrefProduto, type ProductSummary } from "@/lib/catalogue";
import ProductImage from "./ProductImage";
import AddToQuote from "./AddToQuote";

export default function ProductCard({ product }: { product: ProductSummary }) {
  const href = hrefProduto(product);
  return (
    <article className="pcard">
      <Link href={href} className="imgwrap" aria-label={product.name}>
        <ProductImage img={product.img} cat={product.cat} name={product.name} />
      </Link>
      <div className="body">
        <div className="cat">{product.cat}</div>
        <h3>
          <Link href={href}>{product.name}</Link>
        </h3>
        <div className="ref">
          Ref. {product.ref} · {product.brand}
        </div>
        <p className="desc">{product.desc.split("\n")[0].replace(/^[•·\s]+/, "")}</p>
        <div className="cardfoot">
          <Link href={href} className="details">
            Ver detalhes <span className="arrow">→</span>
          </Link>
          <AddToQuote product={product} variant="card" />
        </div>
      </div>
    </article>
  );
}
