# 🤍 For My Favourite Person — Arsh
### A Dreamy, Interactive, Pinterest-Inspired Digital Scrapbook with Secure Password Protection

A personal romantic love memories website designed as a special greeting and interactive scrapbook for **Arsh**.

---

## 🔒 Password Protection & Security

The website is protected by a romantic, dreamy password gate:
- **Heading**: *"A Little Secret Just for Us 🤍"*
- **Message**: *"Enter our secret password to unlock our memories 💌"*
- **Design**: Soft blush-pink atmosphere, floating hearts, animated gold-and-rose lock icon with a glowing heart emblem.
- **Cute Feedback**:
  - If the password is correct, the lock clicks open, spawns a shower of heart particles, and smoothly reveals the entire website!
  - If the password is incorrect, a cute error message appears (*"Oops! That's not our secret password... Think of our sweet word or special date! 🥺🤍"*) and the card gently wiggles with a shake animation.
- **Eye Toggle**: Allows peeking (`👁️` / `🙈`) at the password while typing.
- **Default Password**: **`arsh2026`**

---

## 🧪 How to Test the Password Protection

1. **Open the Website**:
   - Double-click `d:\arsh-love-website\index.html` (or `d:\index.html`) in your browser.
2. **Test Wrong Password**:
   - Type any incorrect password like `wrong123` and tap **"Unlock Our World 💖"**.
   - Notice the gentle wiggle animation and cute error message.
3. **Test Correct Password**:
   - Type the default password: **`arsh2026`**
   - Click **"Unlock Our World 💖"**.
   - Watch the lock shackle pop open, heart burst ignite, and the dreamy scrapbook world reveal itself!
4. **Test Re-Locking**:
   - In the navigation bar or at the bottom footer, tap **"🔒 Lock Scrapbook"**.
   - The website smoothly returns to the password screen and clears the session.
5. **Test Changing the Password**:
   - Click **"🔑 Change Password"** in the footer.
   - Enter a new secret password and confirm.
   - Try locking and unlocking with your new password!

---

## 🛡️ IMPORTANT: Security & Publishing Guide (Requirement 11)

### Why Simple JavaScript Password Checks Are Insecure
Many beginner websites use:
```javascript
// ❌ INSECURE - Anyone can right-click "View Page Source" to see this:
if (passwordInput.value === "mysecretpassword") { ... }
```
If you do this, anyone can press `Ctrl + U` (or inspect Developer Tools) and read the password in seconds.

### How Our Current Code Solves This (Client-Side Cryptographic Hashing):
Instead of storing the password in plain text, our code uses **Web Crypto API SHA-256 one-way hashing**:
- `script.js` line ~23 only contains:
  ```javascript
  const DEFAULT_PASSWORD_HASH = "9a1de7c21aa9510d8baf3f654bdd1e9256507e9277e2402148faf8b1a15a5bee";
  ```
- `9a1de7c21aa9510d8baf3f654bdd1e9256507e9277e2402148faf8b1a15a5bee` is the mathematical hash of `arsh2026`.
- Even if someone inspects the source code, **it is mathematically impossible to reverse-engineer the password from the hash**.

---

### How to Implement True Server-Side Authentication Before Publishing Publicly

While SHA-256 hashing hides the password from view, on a pure static webpage, someone with technical knowledge could look at the `img` tags or text in the HTML payload before unlocking. 

If you want **100% military-grade privacy** so nobody on the internet can see your photos or memories without the password, choose one of these standard methods before publishing:

#### Method A: Netlify Password Protection / Basic Auth (Easiest & Recommended — No Coding!)
If you host your site on Netlify:
1. Drag and drop `arsh-love-website` onto [app.netlify.com/drop](https://app.netlify.com/drop).
2. Go to your site dashboard: **Site Configuration** -> **Access Management** -> **Visitor Access**.
3. Enable **Password Protection** and set a password.
4. Netlify’s web server will now block all requests at the server level until the correct password is provided. No HTML, images, or audio will ever be downloaded by unauthorized visitors.

#### Method B: Cloudflare Pages / Workers Basic Auth (Free & Fast)
If you deploy via Cloudflare Pages:
1. Deploy your site to Cloudflare Pages.
2. In Cloudflare, add a simple Cloudflare Worker route or Zero Trust Access rule.
3. The server checks HTTP Basic Authentication headers before returning any website assets.

#### Method C: Static AES-256 Payload Encryption (PageCrypt / Static-Crypt)
If you want to host on **GitHub Pages** (which doesn't have a backend server) with true encryption:
1. Tools like **PageCrypt** or **static-crypt** take your `index.html` and encrypt the entire content using **AES-256-GCM**.
2. The deployed `index.html` contains zero memories and zero photos — only encrypted ciphertext and a decryption prompt.
3. When Arsh enters the password, the browser derives the AES key using PBKDF2 and decrypts the website in memory. Without the password, no files or text can be extracted.

#### Method D: Node.js Express / Python Backend
If you want to run your own custom web server:
- Serve static files only after checking an HTTP session cookie:
```javascript
// Express.js Example
app.post('/api/login', (req, res) => {
  if (bcrypt.compareSync(req.body.password, serverPasswordHash)) {
    req.session.authenticated = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});
```

---

## 🎨 How to Change the Password Manually in `script.js`

If you want to set your own custom password permanently in the source code:
1. Open your browser console (`F12` -> `Console`) while on the website.
2. Run this quick command (replace `'yournewpassword'` with your choice):
   ```javascript
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('yournewpassword'))
     .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join(''))
     .then(hash => console.log("Your new hash is:", hash));
   ```
3. Copy the output hash.
4. Open `script.js` and update line 23:
   ```javascript
   const DEFAULT_PASSWORD_HASH = "your_copied_hash_here";
   ```

---

## ✨ Full Feature List

1. **Password Gate Screen**:
   - Soft pink glowing backdrop, animated lock, hint toggle, shake error on invalid attempt.
2. **Dreamy Welcome Page**:
   - Title: *"For My Favourite Person 🤍"*
   - Large glowing title: **ARSH** with shimmering typography.
   - Animated beating heart with layered radiant glow rings.
   - *"Open Your Little World 💌"* button.
3. **Our Photo Gallery 📸**:
   - Scrapbook polaroid frames with realistic tilt angles and washi tape.
   - **Direct Mobile/Desktop Photo Uploads**: Tap camera icon (📷) to pick a photo from your phone.
   - Fullscreen **Photo Lightbox** with captions and *"Loved ❤️"* heart reaction.
   - **Slideshow Mode**: Tap *"▶ Slideshow"* to watch your memories play.
4. **Our Memory Map 📍**:
   - *"Places That Hold Our Memories"*
   - Place cards with Place Name, Date, Photo, Personal Story Note, and Google Maps link.
   - Add/edit/delete places saved to your device.
5. **Our Romantic Timeline 🗓️**:
   - Vertical romantic timeline connected by a soft pink glowing ribbon.
   - In-app milestone editor to add new chapters.
6. **Our Little Moments 💌**:
   - Romantic memory cards (*"My Favourite Memory"*, *"The Day I Smiled the Most"*, etc.).
7. **A Letter For You 💗 (3D Interactive Envelope)**:
   - Closed romantic envelope sealed with a golden wax seal (*"A & Me 🤍"*).
   - Tap to unfold: seal breaks, flap opens, parchment letter slides out.
   - Editable in-page or in code.
8. **Our Love Soundtrack (Music Player) 🎵**:
   - Floating romantic mini-player widget with spinning vinyl disc.
   - **Built-in Acoustic Piano Lullaby**: Synthesizes a soothing romantic melody via Web Audio API (works 100% reliably out of the box with zero external dependencies!).
   - **Custom Song Upload**: Select any MP3 directly from your device.
   - **Local Music Folder**: Drop songs into `music/` folder.
9. **Our Countdown & Special Dates ⏳**:
   - Live countdown to Arsh's Next Birthday (Days, Hours, Minutes, Seconds).
   - Real-time Love Journey Counter (Days together since anniversary).
10. **Final Surprise 🎁**:
    - Sparkling gift box with *"One Last Thing... 💖"*.
    - Proclamation of love, shower of animated floating hearts, and WhatsApp share link!

---

## 🌐 Publishing to Share with Arsh

1. **Netlify Drop (Fastest — 30 Seconds)**:
   - Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
   - Drag and drop the `arsh-love-website` folder.
   - Enable Password Protection in site settings for complete server-side security.
   - Send the link to Arsh!
2. **GitHub Pages / Vercel**:
   - Push to a GitHub repository and turn on Pages.

*Made with love for Arsh 🤍*
