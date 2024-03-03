export default function CookiesPage() {
  return (
    <section className="prose prose-invert prose-a:text-white prose-p:text-white py-10">
      <h1>Use of Cookies</h1>
      <h2>Spotify Access Tokens</h2>
      <p>
        To enhance your experience and integrate our services with Spotify, we
        store temporary access tokens on your device. These tokens are essential
        for accessing your Spotify data as per your permissions and providing
        personalized features within our app.
      </p>
      <h3>Purpose:</h3>
      <p>
        These tokens are used solely for maintaining a connection with Spotify,
        ensuring you can access your Spotify-related features without repeated
        logins.
      </p>
      <h3>Duration:</h3>
      <p>
        Access tokens are temporary and are only stored for the duration of your
        session to safeguard your privacy and security.
      </p>
      <h3>Your Control:</h3>
      <p>
        If you wish to remove these tokens, you can clear your browser's cookies
        and local storage, or log out from our service, which will invalidate
        and clear the stored tokens. For more detailed information on managing
        cookies and local storage in your browser, please refer to your
        browser's help documentation.
      </p>
    </section>
  );
}
