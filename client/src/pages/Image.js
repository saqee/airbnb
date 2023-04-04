export default function Image({ src, ...rest }) {
  src =
    src && src.includes("http://")
      ? src
      : "http://localhost:3001/uploads/" + src
  return <img {...rest} src={src} alt={""} />
}
