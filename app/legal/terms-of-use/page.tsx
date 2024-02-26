import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <section className="prose dark:prose-invert">
      <h1>Terms of Use</h1>
      <p>
        Welcome to MoodWav! Our service is designed to enhance your Spotify
        experience. By using our Service, you agree to these simplified Terms of
        Use. If you're not in agreement with these Terms, then you should
        refrain from using our Service.
      </p>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing our Service, you're confirming that you've read and
        understood these Terms and are in agreement with them.
      </p>
      <h2>2. Changes to Terms</h2>
      <p>
        We may update these Terms as needed. Any changes will be posted here,
        and by continuing to use the Service after changes are made, you're
        agreeing to the new Terms.
      </p>
      <h2>3. Account Registration</h2>
      <p>
        To use our Service, you'll need to log in with your Spotify account.
        Make sure your account details are correct and secure.
      </p>
      <h2>4. Using Our Service</h2>
      <p>
        Our Service integrates with Spotify, allowing you access to various
        features. Your use of our Service should respect all applicable laws and
        Spotify's terms.
      </p>
      <h2>5. Ownership</h2>
      <p>
        The content and functionality of our Service are owned by MoodWav and
        are protected by copyright and other intellectual property laws.
      </p>
      <h2>6. Termination</h2>
      <p>
        We reserve the right to terminate or suspend access to our Service for
        any breach of these Terms.
      </p>
      <h2>7. No Warranties</h2>
      <p>
        We provide our Service "as is," and we don't offer any warranties
        regarding its reliability, availability, or ability to meet your needs.
      </p>
      <h2>8. Limitation of Liability</h2>
      <p>
        MoodWav won't be liable for any damages or losses resulting from your
        use of our Service.
      </p>
      <h2>9. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of Ontario, Canada, without regard to its conflict of law
        provisions.
      </p>
      <h2>10. Service Changes</h2>
      <p>
        We may change or discontinue any aspect of our Service at any time
        without notice.
      </p>
      <h2>11. Contact</h2>
      <p>
        For any questions regarding these Terms, please get in touch{" "}
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
