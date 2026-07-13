export default async function HotelDetail({ params }) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-display font-semibold text-ink">Hotel #{id}</h1>
    </div>
  );
}
