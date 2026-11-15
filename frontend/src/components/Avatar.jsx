// Shows the profile picture, or the first letters of the name in a circle
const COLORS = ["#1d4ed8", "#0891b2", "#7c3aed", "#059669", "#db2777", "#ea580c"];

export default function Avatar({ name = "?", src, size = 48 }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = COLORS[name.length % COLORS.length];
  const style = { width: size, height: size, fontSize: size * 0.38 };

  if (src) return <img className="avatar" src={src} alt={name} style={style} />;
  return (
    <div className="avatar" style={{ ...style, background: color }} aria-label={name}>
      {initials}
    </div>
  );
}
