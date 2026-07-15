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

## BUG
React mounts component
      ↓
useEffect runs
      ↓
new Game() created → init() starts
      ↓
init hits "await getShapesAction()" → PAUSES
      ↓
React decides to re-render (width/height changed)
      ↓
cleanup function runs → gameObj.cleanEvents()
      ↓
BUT init hasn't finished yet!
initEvents() hasn't been called yet!
So cleanEvents() removes listeners that don't exist yet
      ↓
init resumes after await completes
      ↓
initEvents() FINALLY runs → registers events
      ↓
New Game() also created → registers its own events
      ↓
Now TWO games have active events ❌
cleanup already ran and had nothing to remove

SOlution for this is boolean flag whcih will turn true if clean up is called and if boolean is true than event will not be registered. to prevent 2 callses with registrered events.

## Crisp lines
so the thing is that css got less pixels than retina screen and that's why out shapes look blurry because they are draw on css pixels.

Using dpr we have increases css pixels and scaled the canvas to render shapes correctly.

## Subtracting panning 
        this.panX -= e.deltaX 
        this.panY -= e.deltaY
1. if canvas is moved 60 px right than 
   screen view of rect which is at 100 -> 100 - 60 =40
   will become 40 because rect moved 60 px left which makes viewport appear move to right.

## Panning 
Shape at world position x=100
panX = 0

screenX = worldX * scale + panX
screenX = 100 * 1 + 0 = 100
Shape appears at screen pixel 100

You swipe right → panX becomes +50

screenX = 100 * 1 + 50 = 150
Shape now appears at screen pixel 150
→ Shape MOVED RIGHT on screen ✅

The empty canvas to the LEFT is now visible
→ Canvas background MOVED LEFT ✅

## for loop vs for each
Rule of thumb

Use forEach when:

arr.forEach(user => {
    console.log(user.name);
});

You simply want to perform an action on every element.

Use for (or for...of) when:

you need break
you need continue
you need to return early
you need the index in a custom way
you need maximum control

Example:

for (const user of users) {
    if (user.id === targetId) {
        return user;
    }
}

This is impossible with forEach.

Many modern TypeScript developers actually prefer:

for (const item of arr) {
    ...
}

over

for (let i = 0; i < arr.length; i++) {
    ...
}

because it gives the same control (break, continue, return) while being cleaner to read.

## Pass by value and reference
JavaScript is always pass by value. -> creates copy 

But for objects and arrays, the value being copied is a reference. -> uses exact variable

## REDIS BUG
1. reids can only string so that;s why we need to conver the string into json object beofre storing it itn to db
2. And adnd prisma automatically convers json obj in to js obj beofre retruning. 

## Drawing text on canvas
1. The canvas can't natively accept keyboard input. So when user selects the text tool and clicks, you create a real HTML <textarea> element floating over the canvas at that exact position. User types in it, then it disappears and the text gets drawn permanently on the canvas.
2. 
User clicks canvas with text tool
      ↓
Real <textarea> appears at that position
      ↓
User types
      ↓
User presses Enter or clicks away
      ↓
textarea disappears
Text committed to canvas as a shape
3. 
screenX = e.clientX     → where textarea appears visually
                           changes when you pan/zoom
                           
worldX = worldCoords.x  → where shape is stored
                           stays fixed regardless of pan/zoom
                           
textarea uses screenX ✅  (needs to appear at click position)
shape uses worldX ✅      (needs to survive pan/zoom)

Sure. Let me break it down section by section.

---

**The big picture:**

The canvas can't natively accept keyboard input. So when user selects the text tool and clicks, you create a real HTML `<textarea>` element floating over the canvas at that exact position. User types in it, then it disappears and the text gets drawn permanently on the canvas.

```
User clicks canvas with text tool
      ↓
Real <textarea> appears at that position
      ↓
User types
      ↓
User presses Enter or clicks away
      ↓
textarea disappears
Text committed to canvas as a shape
```

---

**Part 1 — Prevent duplicate text boxes:**

```typescript
if (document.getElementById('canvas-text-input')) return
```

If user somehow clicks twice while a textarea is already open — don't create a second one. The `id` check ensures only one textarea exists at a time.

---

**Part 2 — Create and position the textarea:**

```typescript
const textArea = document.createElement("textarea")
textArea.id = 'canvas-text-input'

textArea.style.position = "fixed"
textArea.style.left = `${e.clientX}px`   // ← screen X where user clicked
textArea.style.top = `${e.clientY}px`    // ← screen Y where user clicked
```

`fixed` positioning means it's placed relative to the viewport — so it appears exactly where you clicked on screen, sitting on top of the canvas visually.

```typescript
textArea.style.background = "transparent"  // ← invisible background
textArea.style.outline = "none"            // ← no focus ring
textArea.style.resize = "none"             // ← no resize handle
textArea.style.zIndex = "1000"             // ← sits above canvas
```

These styles make it look like you're typing directly onto the canvas — the textarea is invisible except for the text itself.

---

**Part 3 — Append and focus:**

```typescript
document.body.appendChild(textArea)
setTimeout(() => textArea.focus(), 0)
```

`setTimeout(..., 0)` delays focus by one event loop tick. This is needed because the `mousedown` event is still being processed when this code runs — focusing immediately can get cancelled by the browser. The tiny delay lets the event finish first.

---

**Part 4 — The `isSubmitted` flag:**

```typescript
let isSubmitted = false

const submitText = () => {
    if (isSubmitted) return  // ← prevent double submission
    isSubmitted = true
    // ...
}
```

This solves a subtle bug — when user presses Enter:
1. `keydown` event fires → calls `submitText()`
2. Enter key causes textarea to lose focus
3. `blur` event fires → also calls `submitText()`

Without the flag, text would be submitted twice — two shapes created. The flag ensures `submitText` only runs once no matter how many times it's called.

---

**Part 5 — `submitText` function:**

```typescript
const submitText = () => {
    if (isSubmitted) return
    isSubmitted = true

    const text = textArea.value    // ← get what user typed
    textArea.remove()              // ← remove the HTML textarea

    if (text.trim().length > 0) {  // ← only save if not empty
        const shape = {
            type: "text",
            id: crypto.randomUUID(),
            x: worldCoords.x,     // ← world position (not screen position)
            y: worldCoords.y,     // ← important for pan/zoom to work
            text: text,
            storkeColor: colorMap[this.storkeColor],
            storkeWidth: widthMap[this.storkeWidth]
        }

        this.existingShapes.push(shape as any)
        this.render()              // ← draw it on canvas

        this.socket.send(...)      // ← broadcast to other users
    }
}
```

Notice it uses `worldCoords.x/y` not `e.clientX/y`. This is critical — the textarea is positioned using screen coordinates but the shape is stored in world coordinates so it works correctly with pan and zoom.

---

**Part 6 — Three ways to trigger submission:**

```typescript
// 1. Click outside → blur fires
textArea.addEventListener("blur", submitText)

// 2. Press Enter (not Shift+Enter which adds new line)
textArea.addEventListener("keydown", (keyEvent) => {
    if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
        keyEvent.preventDefault()  // ← stops Enter from adding a newline
        submitText()
    }

    // 3. Press Escape → cancel without saving
    if (keyEvent.key === "Escape") {
        isSubmitted = true   // ← set flag so blur doesn't submit
        textArea.remove()    // ← just remove, don't save
    }
})
```

---

**Part 7 — Auto-resize:**

```typescript
textArea.addEventListener("input", () => {
    textarea.style.height = "auto"
    textarea.style.height = textarea.scrollHeight + "px"
    textarea.style.width = "auto"
    textarea.style.width = textarea.scrollWidth + "px"
})
```

Every keystroke:
1. Reset height to `auto` so `scrollHeight` recalculates correctly
2. Set height to exact content height
3. Same for width

This makes the textarea grow as you type — so it always shows all your text without scrollbars, making it feel like you're typing directly on the canvas.

---

**The two coordinate systems in this function:**

```
screenX = e.clientX     → where textarea appears visually
                           changes when you pan/zoom
                           
worldX = worldCoords.x  → where shape is stored
                           stays fixed regardless of pan/zoom
                           
textarea uses screenX ✅  (needs to appear at click position)
shape uses worldX ✅      (needs to survive pan/zoom)
```

This is the most important design decision in the whole function — using the right coordinate system for each purpose.
