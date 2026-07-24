import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  )
}

export function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Data Privacy Statement"
        description="How Paddimi Multi Concepts collects, uses, and protects your personal data."
        icon={<Shield className="h-7 w-7" />}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-muted">
          <strong className="text-foreground">Last Updated:</strong> July 16, 2026
        </p>

        <div className="mt-10 space-y-10">
          <Section title="1. Introduction">
            <p>
              PADDIMI MULTI CONCEPTS (&quot;Company,&quot; &quot;We,&quot; &quot;Us,&quot; &quot;Our&quot;) is committed to
              safeguarding the privacy and protection of personal data in compliance with the
              Nigeria Data Protection Act (NDPA) 2023 and the General Application and
              Implementation Directive (GAID) 2025. This Data Privacy Statement explains how
              we collect, use, store, share, and protect your personal data when you interact with
              our website (paddimi.mc.com) and use our affidavit and newspaper publication
              services.
            </p>
            <p>
              By using our Services, you accept the practices described in this Privacy Statement
              and give us consent to collect, store, process, and use your personal data to the
              extent permitted under the NDPA. You have the right to withdraw your consent at
              any time, provided we do not have another lawful basis to continue processing your
              data.
            </p>
          </Section>

          <Section title="2. Scope">
            <p>This Privacy Statement applies to all individuals whose personal data we process, including:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">Clients and Users</strong> — Individuals requesting affidavits or newspaper publications.</li>
              <li><strong className="text-foreground">Website Visitors</strong> — Individuals browsing our website.</li>
              <li><strong className="text-foreground">Third-Party Contacts</strong> — Vendors, partners, and service providers.</li>
            </ul>
          </Section>

          <Section title="3. Definitions">
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">Personal Data</strong> — Any information relating to an identified or identifiable natural person, including names, contact details, identification numbers, and online identifiers.</li>
              <li><strong className="text-foreground">Data Processing</strong> — Any operation performed on personal data, whether automated or not, including collection, recording, storage, alteration, retrieval, or deletion.</li>
              <li><strong className="text-foreground">Data Subject</strong> — The individual to whom the personal data relates.</li>
              <li><strong className="text-foreground">Data Controller</strong> — PADDIMI MULTI CONCEPTS, which determines the purposes and means of processing personal data.</li>
              <li><strong className="text-foreground">Data Processor</strong> — A third party that processes personal data on our behalf.</li>
            </ul>
          </Section>

          <Section title="4. Types of Personal Data We Collect">
            <p>We collect and process the following categories of personal data:</p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="bg-surface-elevated">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-foreground">Category</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Examples</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-4 py-3 font-medium">Identity Data</td><td className="px-4 py-3">First name, middle name, last name, sex, religion, occupation</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Contact Data</td><td className="px-4 py-3">Phone number, email address, address, town, city, state, Local Government Area</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Document Data</td><td className="px-4 py-3">Passport photographs, old name, new name, spouse name, date of marriage</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Service-Specific Data</td><td className="px-4 py-3">For affidavits: declaration details, date of birth, relationship status, vehicle details, SIM card details, etc.</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Technical Data</td><td className="px-4 py-3">IP address, browser type, device information, cookies, website usage analytics</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Communication Data</td><td className="px-4 py-3">Records of correspondence when you contact us</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              We do not collect sensitive personal data (such as health records, biometrics, or
              political views) except as expressly required for the specific service you request.
            </p>
          </Section>

          <Section title="5. Lawful Basis for Processing">
            <p>We process your personal data only on one or more of the following lawful bases:</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li><strong className="text-foreground">Consent</strong> — You have given clear, informed consent for processing your data for a specific purpose.</li>
              <li><strong className="text-foreground">Contractual Necessity</strong> — Processing is necessary to perform the contract we have with you or to take steps to enter into a contract.</li>
              <li><strong className="text-foreground">Legal Obligation</strong> — Processing is required to comply with legal and regulatory obligations.</li>
              <li><strong className="text-foreground">Legitimate Interest</strong> — Processing is necessary for our legitimate interests or those of a third party, provided such interests are not overridden by your rights and freedoms.</li>
            </ol>
          </Section>

          <Section title="6. How We Use Your Personal Data">
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">Service Delivery</strong> — To process your affidavit or newspaper publication request, generate redemption codes, and deliver documents.</li>
              <li><strong className="text-foreground">Payment Processing</strong> — To facilitate payments through our payment gateways (Paystack and Flutterwave).</li>
              <li><strong className="text-foreground">Communication</strong> — To send you SMS and email notifications regarding your request status, payment confirmation, redemption code, and document readiness.</li>
              <li><strong className="text-foreground">Customer Support</strong> — To respond to your enquiries, complaints, and requests.</li>
              <li><strong className="text-foreground">Record Keeping</strong> — To maintain records of processing activities as required by law.</li>
              <li><strong className="text-foreground">Website Improvement</strong> — To monitor and analyse website usage, trends, and activities.</li>
              <li><strong className="text-foreground">Security</strong> — To protect our platform from fraud, unauthorised access, and other security threats.</li>
            </ul>
          </Section>

          <Section title="7. Data Sharing and Third Parties">
            <p>We may share your personal data with third parties in the following circumstances:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Service Providers</strong> — With trusted third-party vendors who process data on our behalf, including:
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Payment gateways (Paystack and Flutterwave)</li>
                  <li>SMS provider (Termii)</li>
                  <li>Email service provider (Resend)</li>
                  <li>Cloud storage and database provider (Supabase)</li>
                  <li>Newspaper publication partners</li>
                </ul>
                We require these parties to process your data in accordance with our instructions
                and in compliance with applicable data protection laws.
              </li>
              <li><strong className="text-foreground">Regulatory Authorities</strong> — With the Nigeria Data Protection Commission (NDPC) or other government agencies when required by law or court order.</li>
              <li><strong className="text-foreground">With Your Consent</strong> — When you explicitly direct us to share your data with a third party.</li>
            </ul>
            <p>We do not sell or rent your personal data to third parties for marketing purposes.</p>
          </Section>

          <Section title="8. Data Storage and Security">
            <p><strong className="text-foreground">8.1 Storage</strong></p>
            <p>
              We process personal data in both digital and physical formats. Digital data is stored
              on secure cloud platforms with data centres that may be located both within and
              outside Nigeria.
            </p>
            <p><strong className="text-foreground">8.2 Security Measures</strong></p>
            <p>
              We implement appropriate technical and organisational measures to protect your
              personal data from loss, theft, misuse, unauthorised access, disclosure, alteration,
              and destruction:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">Technical Measures:</strong> Encryption of data in transit and at rest, role-based access control, firewalls, regular security testing, and audit logging.</li>
              <li><strong className="text-foreground">Organisational Measures:</strong> Limited access to authorised personnel only, staff training on data protection, and clearly defined data retention policies.</li>
            </ul>
          </Section>

          <Section title="9. International Data Transfers">
            <p>
              We may transfer your personal data to countries outside Nigeria when using third-party
              service providers (such as cloud storage providers). Where such transfers occur, we ensure that:
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>The recipient country has data protection laws that are adequate and comparable to those in Nigeria; or</li>
              <li>We implement appropriate safeguards, such as Standard Contractual Clauses approved by the NDPC, to ensure your data remains protected.</li>
            </ol>
            <p>
              You acknowledge that when your data is transferred to other countries, there may be
              an increased risk that your personal information could be compromised due to
              weaker enforcement mechanisms. We take reasonable steps to mitigate these risks.
            </p>
          </Section>

          <Section title="10. Data Retention Period">
            <p>We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">Document and Redemption Code Data</strong> — Retained for one (1) year from the date of issuance, as specified in our Terms and Conditions.</li>
              <li><strong className="text-foreground">Transaction Records</strong> — Retained for as long as required by law or regulatory obligations.</li>
              <li><strong className="text-foreground">Communication Records</strong> — Retained as necessary for customer service and dispute resolution.</li>
            </ul>
            <p>
              When your data is no longer required, we will securely dispose of it through secure
              deletion (digital records) or shredding (physical records), subject to applicable law.
            </p>
          </Section>

          <Section title="11. Your Rights as a Data Subject">
            <p>Under the NDPA, you have the following rights regarding your personal data:</p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="bg-surface-elevated">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-foreground">Right</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-4 py-3 font-medium">Right of Access</td><td className="px-4 py-3">You have the right to request a copy of the personal data we hold about you.</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Right to Rectification</td><td className="px-4 py-3">You have the right to correct inaccurate or incomplete data we hold about you.</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Right to Erasure</td><td className="px-4 py-3">You have the right to request deletion of your personal data where there is no compelling legal or regulatory requirement for its continued processing.</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Right to Restrict Processing</td><td className="px-4 py-3">You have the right to restrict processing or withdraw your consent at any time.</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Right to Data Portability</td><td className="px-4 py-3">You have the right to request that the data we hold about you be transferred to another organization.</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Right to Object</td><td className="px-4 py-3">You have the right to object to automated processing, including profiling of your data.</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Right to Lodge a Complaint</td><td className="px-4 py-3">You have the right to lodge a complaint with the Nigeria Data Protection Commission if you believe your rights have been violated.</td></tr>
                </tbody>
              </table>
            </div>
            <p>To exercise any of these rights, please contact us using the details provided in Section 16.</p>
          </Section>

          <Section title="12. Redemption Code and Data">
            <p>When you use our Services, we generate a unique 4-digit alphanumeric Redemption Code for you. This code is used to access and download your documents from our website. You acknowledge that:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>The Redemption Code is linked to your personal data and documents.</li>
              <li>You are responsible for maintaining the confidentiality of your Redemption Code.</li>
              <li>Anyone with access to your code can view and download your documents.</li>
            </ul>
            <p>We recommend that you do not share your Redemption Code with unauthorised persons.</p>
          </Section>

          <Section title="13. Cookies and Tracking Technologies">
            <p>
              Our website uses cookies and similar technologies to enhance user experience,
              analyse site usage, and improve our Services. Cookies are small text files stored on
              your device. You can manage your cookie preferences through your browser settings.
            </p>
            <p>We use cookies for:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Essential website functionality</li>
              <li>Analytics and performance monitoring</li>
              <li>User experience improvements</li>
            </ul>
          </Section>

          <Section title="14. Data Breach Notification">
            <p>
              In the event of a security breach leading to the accidental or unlawful destruction,
              loss, alteration, unauthorised disclosure of, or access to personal data, we shall:
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Notify the Nigeria Data Protection Commission (NDPC) within 72 (seventy-two) hours of becoming aware of the breach.</li>
              <li>Notify you, the affected data subjects, as soon as reasonably practicable, if the breach is likely to be detrimental to your rights and freedoms. This notification will include details of the breach, the risk to your rights, and the course of action to remedy the breach.</li>
            </ol>
          </Section>

          <Section title="15. Policy Updates">
            <p>
              We may update this Privacy Statement from time to time without prior notice to
              reflect changes in our data practices, technology, or applicable laws. If such
              changes are made, we will notify you by revising the &quot;Last Updated&quot; date at the top
              of this policy.
            </p>
            <p>
              We encourage you to review this Privacy Statement periodically to stay informed
              about how we protect your personal data.
            </p>
          </Section>

          <Section title="16. Contact Information">
            <p>
              If you have any questions, concerns, or complaints about this Privacy Statement or
              how we handle your personal data, please contact us:
            </p>
            <ul className="list-none space-y-2">
              <li><strong className="text-foreground">Primary Email:</strong>{' '}<a href="mailto:paddimi.mc@gmail.com" className="text-brand-600 hover:underline">paddimi.mc@gmail.com</a></li>
              <li><strong className="text-foreground">Secondary Email:</strong>{' '}<a href="mailto:paddimi.mc@yahoo.com" className="text-brand-600 hover:underline">paddimi.mc@yahoo.com</a></li>
              <li><strong className="text-foreground">Website:</strong> paddimi.mc.com</li>
            </ul>

            <p className="mt-4"><strong className="text-foreground">16.1 Designated Data Protection Officer (DPO)</strong></p>
            <p>If you wish to submit a formal complaint or enquiry regarding your data privacy rights, you may contact our designated Data Protection Officer:</p>
            <ul className="list-none space-y-2">
              <li><strong className="text-foreground">Name:</strong> Sopuruchi Onwubuche</li>
              <li><strong className="text-foreground">Email:</strong>{' '}<a href="mailto:paddimi.mc@yahoo.com" className="text-brand-600 hover:underline">paddimi.mc@yahoo.com</a></li>
              <li><strong className="text-foreground">Phone:</strong>{' '}<a href="tel:+2347038056560" className="text-brand-600 hover:underline">07038056560</a></li>
            </ul>

            <p className="mt-4"><strong className="text-foreground">16.2 Nigeria Data Protection Commission</strong></p>
            <p>If you are dissatisfied with our response to your privacy concerns, you have the right to lodge a complaint with the Nigeria Data Protection Commission:</p>
            <ul className="list-none space-y-2">
              <li><strong className="text-foreground">Address:</strong> Nigeria Data Protection Commission</li>
              <li><strong className="text-foreground">Phone:</strong> +234 (0) 916 061 5551</li>
              <li><strong className="text-foreground">Email:</strong>{' '}<a href="mailto:info@ndpc.gov.ng" className="text-brand-600 hover:underline">info@ndpc.gov.ng</a></li>
              <li>
                <strong className="text-foreground">Website:</strong>{' '}
                <a href="https://ndpc.gov.ng/" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">https://ndpc.gov.ng/</a>
              </li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <Link to="/" className="text-sm font-medium text-brand-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </>
  )
}
