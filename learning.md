1. The problem is that when we pass tailwind class as props and if it conflics in that case we should use:
2. bun add clsx tailwind-merge in app
3. clsx handles conditional classes, tailwind-merge resolves conflicts like rounded-xl vs rounded-sm.

4. Server  action is TypeScript Remote Procedure Call.
5. it is the funciton which is run on server. usually used for manipulating DB directly. 
6. Also no need to create separate route to send DB req using SA.
7. cause in next both backend and front is hosted on same server that's why we can send Db request direstly from DB and that same DB backend can also access

8 USEACTIONSTATE HOOK: Are used to use forms effectively.
1. useActionState hooks return the array elements. -> 1st element is state — the value your server action returned last time it ran:
2. 2nd element is action — a wrapped version of your server action to pass to form action:
   <form action={action}>        // ✅ wrapped action, state updates after each run
   3rd arg is isloading which tells if action is completed or not.
3. Argguments it takes-> 1st arg is server Action which ran and return some data which is stored inside state elem and cause the compoenent to re-render.
4. 2nd arg is initial value for the state
5. Important when we are using useActionState hook with server action we need to give param previousstate to SA.
6. so the previus state will be null for SA if we have provide null in useActionState hook.
7. In short useActionState() is the the hook which allow us to update the state with side effects using server Action.

Mind Map for server action and form.
1. Server action take sthe input from Form and runs it on server and returns some data.
2. But how can we get and render the data returned by Server Action.
3. For that we use useActionState() hook which allow us to update the state with side effects using server action.
4. warapped server action returns some data get stored in state which allow us to access returned data.

1. Page loads → JS hydrates SignupForm in browser

2. User fills inputs and clicks submit

3. Browser sees <form action="/_next/action/abc123">
   → standard HTML form submission
   → browser serializes all input[name] into FormData
   → sends POST request to /_next/action/abc123

4. Next.js  server receives the request
   → calls your signUpAction(prevState, formData)
   → runs on server (DB access, bcrypt, etc.)

5. Server returns new state
   → Next.js sends it back to browser
   → useActionState updates state
   → UI re-renders with errors or redirects
The user inputs are transported like always using POST request to the server action endpoint.

8. We need DB url in apps too cause:
packages/db/.env        ← for prisma migrate, prisma studio
apps/inkflowapp/.env    ← for Next.js runtime (server actions, API routes)
This is a monorepo pain point — just keep both in sync with the same DATABASE_URL.

9. ?? returns right side if left is null or undefined but not in the case of 0 or ""

## tubro.json
 "build": {
      "dependsOn": ["^build"], -> ^ this means first build dependencies before building packages or apps
      "inputs": ["$TURBO_DEFAULT$", ".env*"], -> Check source code etc and env variables to see if cache is valid. if source code or env is                                          changed build task will excute again.
      "outputs": [".next/**", "!.next/cache/**"] -> folder where caches is stored ! -> ignores folder, add dist folder if we want to convert typescript code in javascript and cache it.
    }


## NEXT AUTH authOptions
Good question. Let me explain exactly what changed and why it works now.

---

**Before — inline, not exported:**

```typescript
// ❌ authOptions was anonymous — trapped inside NextAuth()
const handler = NextAuth({
    providers: [...],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id  // this callback existed
            return session              // but nobody outside could use this config
        }
    }
})

export { handler as GET, handler as POST }
// Only the handler was exported — the config object was lost
```

When you called:
```typescript
const session = await getServerSession()  // no config passed
```

NextAuth had no idea about your callbacks. It used its **default session shape** — only `name`, `email`, `image`. Your `id` callback never ran. So `session.user.id` = `undefined`.

---

**After — extracted and exported:**

```typescript
// ✅ authOptions is now a named, exported variable
export const authOptions: NextAuthOptions = {
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id  // ← this now runs
            return session
        }
    }
}

const handler = NextAuth(authOptions)
```

Now when you call:
```typescript
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const session = await getServerSession(authOptions)  // ← config passed
```

The full picture of what happens:

```
getServerSession(authOptions)
        ↓
NextAuth reads your callbacks
        ↓
jwt callback runs:
  token.id = user.id  ✅
        ↓
session callback runs:
  session.user.id = token.id  ✅
        ↓
session returned with id populated
        ↓
session.user.id = "7"  ✅
```

---

**The key insight:**

`getServerSession()` and `NextAuth()` are two separate function calls that both need the same config:

```
NextAuth(authOptions)
  → handles /api/auth/* routes
  → login, logout, session creation
  → uses authOptions to know HOW to create sessions

getServerSession(authOptions)
  → reads the current session anywhere on the server
  → needs authOptions to know HOW to decode the session
  → without it, only returns default shape (no id)
```

They're like two people who need to read the same manual to communicate correctly. Before, only `NextAuth` had the manual. Now both have it.

## tailwind
fixed → Take the element out of the normal document flow and position it relative to the viewport.
inset-0 → Make it fill the entire viewport.

## Enums
1. It is the special datatype that allow us to represent define set of named constants.