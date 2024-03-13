import Link from "next/link";

export default function PrivacyPage() {
  return (
    <section className="prose prose-invert prose-a:text-white prose-li:text-white prose-li:list-disc prose-p:text-white py-10">
      <h1>Privacy Policy</h1>
      <p>
        We are committed to protecting your privacy and ensuring you have a
        positive experience on our platform. This Privacy Policy outlines our
        practices regarding the collection, use, and disclosure of your
        information when you use our service and the choices you have associated
        with that data.
      </p>
      <h2>Information Collection and Use</h2>
      <p>
        For a better experience while using our Service, we may require you to
        provide us with certain personally identifiable information, including
        but not limited to your email address and name. The information that we
        collect will be used to contact or identify you, and is stored securely
        within our Authentication system.
      </p>
      <h2>Spotify Integration</h2>
      <p>
        Our service allows you to connect and sign in using Spotify. This
        integration is designed to enhance your experience by allowing you to:
      </p>
      <ul className="marker:text-white">
        <li>View your recently played tracks</li>
        <li>Access your top tracks and artists</li>
        <li>View artists you follow</li>
        <li>Modify your library</li>
      </ul>
      <p>
        When you choose to connect your Spotify account, we request specific
        permissions (scopes) to access these features. The scopes include:
      </p>
      <ul className="marker:text-white">
        <li>user-read-recently-played</li>
        <li>user-top-read</li>
        <li>streaming</li>
        <li>user-read-playback-state</li>
        <li>user-modify-playback-state</li>
        <li>user-follow-read</li>
        <li>user-library-modify</li>
        <li>user-library-read</li>
      </ul>
      <h2>Data Storage and Security</h2>
      <p>
        Please note, we do not store your Spotify ID or any other Spotify
        account-specific information within our systems. The only personal
        information we retain is your email and name, as provided during the
        authentication process, securely stored within our authntication system.
      </p>
      <h2>Your Data Protection Rights</h2>
      <p>
        We are dedicated to ensuring your rights are protected. You have the
        right to: Access, update or delete the information we have on you.
        Rectification if that information is inaccurate or incomplete. Object to
        our processing of your personal data. Data portability of the
        information you provided to us. If you have any requests or concerns
        regarding your data, please contact us{" "}
        <Link
          href={"/contact"}
          className="font-light text-card-foreground hover:text-primary hover:underline"
        >
          here
        </Link>
        .
      </p>
      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. Thus, we advise you
        to review this page periodically for any changes. We will notify you of
        any changes by posting the new Privacy Policy on this page. These
        changes are effective immediately after they are posted on this page.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions or suggestions about our Privacy Policy, do
        not hesitate to contact us{" "}
        <Link
          href={"/contact"}
          className="font-light text-card-foreground hover:text-primary hover:underline"
        >
          here
        </Link>
        .
      </p>
    </section>
  );
}
