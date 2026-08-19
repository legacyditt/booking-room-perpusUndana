# TODO

## Future Work

- **Server prefetch + Hydration (Tanstack Query):** Halaman server component saat ini mengirim props sebagai `initialData` ke query hooks. Optimasi berikutnya: fetch data di server dengan `getQueryClient().prefetchQuery()` lalu `HydrationBoundary` + `dehydrate()` di layout, sehingga props drilling bisa dihapus dan cache langsung terisi tanpa double-fetch.