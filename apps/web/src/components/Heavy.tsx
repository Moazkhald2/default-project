export default function Heavy() {
  return (
    <p className="mt-4 text-sm opacity-70">
      Lazy chunk — proves code-splitting. Check Network: this loads only when rendered.
    </p>
  );
}
