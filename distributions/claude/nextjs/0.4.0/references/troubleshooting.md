# Next.js Troubleshooting

### A next/navigation hook fails because the component is on the server
**Cause**
`useRouter()`, `usePathname()`, and `useSearchParams()` are Client Component hooks and cannot run inside a Server Component.

**Fix**
Move the interactive logic into a Client Component boundary and pass server-fetched data down as props if needed.

### Data stays stale after a server-side mutation
**Cause**
The write completed, but the relevant Next.js cache path or cache tag was not invalidated.

**Fix**
Choose `revalidatePath()` or `revalidateTag()` based on how the data is cached, and keep the invalidation call in the server-side mutation path.

### Pages Router code was mixed into an App Router task
**Cause**
Stale Next.js advice or migration confusion pulled `getServerSideProps` or `getStaticProps` into an `app/` solution.

**Fix**
Reset the answer to the correct router model, then use App Router file conventions and server/client boundaries explicitly.
