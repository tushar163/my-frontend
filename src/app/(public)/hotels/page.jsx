"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, Star, Search } from "lucide-react";
import { getHotels } from "@/service/hotels";

const DEBOUNCE_MS = 500;

export default function HotelsListing() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  const debounceRef = useRef(null);

  // Debounce: update debouncedSearch only after typing pauses
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getHotels({
        page,
        limit,
        search: debouncedSearch || undefined,
      });
      const list = result.data?.hotels || result.hotels || [];
      const total = result.meta?.total ?? list.length;
      setHotels(list);
      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    } catch (err) {
      setError(err?.message || "Failed to load hotels");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Submit button / Enter key: skip the debounce wait and search immediately
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setPage(1);
    setDebouncedSearch(search);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-display font-semibold text-ink">Hotels</h1>
      <p className="mt-2 text-ink-secondary">Find and book hotels across destinations.</p>

      <form onSubmit={handleSearchSubmit} className="mt-6 flex max-w-md items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-secondary" />
          <input
            className="w-full rounded-md border border-border bg-surface-raised py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-secondary outline-none"
            placeholder="Search by city or hotel name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-ink-inverse"
        >
          Search
        </button>
      </form>

      {isLoading && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-surface-raised" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="mt-10 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {!isLoading && !error && hotels.length === 0 && (
        <div className="mt-10 rounded-md border border-border bg-surface-raised p-8 text-center text-ink-secondary">
          No hotels found. Try a different search.
        </div>
      )}

      {!isLoading && !error && hotels.length > 0 && (
        <>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <Link
                key={hotel.id}
                href={`/hotels/${hotel.id}`}
                className="group overflow-hidden rounded-lg border border-border bg-surface-raised transition-shadow hover:shadow-md"
              >
                <div className="relative h-44 w-full overflow-hidden bg-surface">
                  {hotel.images?.[0] ? (
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-secondary">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-ink">{hotel.name}</h3>
                    {hotel.rating > 0 && (
                      <div className="flex shrink-0 items-center gap-1 text-sm text-warning">
                        <Star className="size-3.5 fill-current" />
                        {hotel.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-sm text-ink-secondary">
                    <MapPin className="size-3.5" />
                    {hotel.city}, {hotel.country}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-secondary">
                    {hotel.description}
                  </p>
                  {hotel.amenities?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {hotel.amenities.slice(0, 3).map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-surface px-2 py-0.5 text-xs text-ink-secondary"
                        >
                          {a}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-ink-secondary">
                          +{hotel.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-ink disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-ink-secondary">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-ink disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}