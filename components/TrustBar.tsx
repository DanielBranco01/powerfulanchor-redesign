const BRANDS = ["Digitus", "HellermannTyton", "RFS", "Brady", "Roxtec"];

export default function TrustBar() {
  return (
    <div className="trust">
      <div className="wrap">
        <span className="trust-label">Marcas representadas</span>
        <ul className="brands">
          {BRANDS.map((brand) => (
            <li key={brand}>{brand}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
