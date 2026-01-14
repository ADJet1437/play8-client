export function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="prose prose-lg max-w-none text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Play8 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our tennis ball machine booking service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Name and contact information (email address, phone number)</li>
            <li>Booking information (court selection, time slots, preferences)</li>
            <li>Payment information (processed through secure third-party providers)</li>
            <li>Account credentials if you create an account</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, booking history)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Process and manage your bookings</li>
            <li>Send booking confirmations and reminders</li>
            <li>Improve our services and user experience</li>
            <li>Communicate with you about your bookings and our services</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information only in the following circumstances:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>With service providers who assist in operating our platform</li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transfer or merger</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Access and receive a copy of your personal data</li>
            <li>Rectify inaccurate or incomplete information</li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar technologies to enhance your experience, analyze usage, and assist in marketing efforts. You can control cookies through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> privacy@play8.ai<br />
            <strong>Address:</strong> Play8, [Your Address]
          </p>
        </section>
      </div>
    </div>
  );
}

