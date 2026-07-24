import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  )
}

export function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms and Conditions"
        description="The rules and agreements for using Paddimi Multi Concepts services."
        icon={<FileText className="h-7 w-7" />}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-muted">
          <strong className="text-foreground">Last Updated:</strong> July 15, 2026
        </p>

        <div className="mt-10 space-y-10">
          <Section title="1. Introduction and Acceptance of Terms">
            <p>
              Welcome to PADDIMI MULTI CONCEPTS. By accessing our website at{' '}
              <a href="https://paddimi.com" className="text-brand-600 hover:underline">paddimi.com</a>{' '}
              and using our services, you agree to be bound by these Terms and Conditions (&quot;Terms&quot;).
              Please read them carefully. If you do not agree with any part of these Terms, you must not use
              our services. These Terms constitute a legally binding agreement between you and PADDIMI MULTI CONCEPTS.
            </p>
          </Section>

          <Section title="2. Definitions">
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">&quot;Company,&quot; &quot;We,&quot; &quot;Us,&quot; &quot;Our&quot;</strong> refers to PADDIMI MULTI CONCEPTS, a company registered with the Corporate Affairs Commission (CAC) of Nigeria.</li>
              <li><strong className="text-foreground">&quot;User,&quot; &quot;You,&quot; &quot;Your&quot;</strong> refers to any individual or entity using our services.</li>
              <li><strong className="text-foreground">&quot;Services&quot;</strong> refers to the facilitation of legal affidavits and newspaper publications as detailed on our website.</li>
              <li><strong className="text-foreground">&quot;Redemption Code&quot;</strong> means the unique 4-digit alphanumeric code sent to you upon payment confirmation, which is used to access and download your completed digital documents from our website.</li>
              <li><strong className="text-foreground">&quot;Platform&quot;</strong> refers to our website and all underlying systems, servers, and software used to deliver our Services.</li>
            </ul>
          </Section>

          <Section title="3. Description of Services">
            <p>
              PADDIMI MULTI CONCEPTS provides an online platform for users to request, pay for, and receive
              legal documents such as affidavits and newspaper publications.
            </p>
            <p><strong className="text-foreground">3.1 Affidavit Services</strong></p>
            <p>We offer various types of affidavits, including but not limited to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Affidavit of Change of Name</li>
              <li>Affidavit of Rearrangement of Name</li>
              <li>Affidavit of Correction of Name</li>
              <li>Affidavit of Correction of Date of Birth</li>
              <li>Affidavit of Confirmation of Name</li>
              <li>Affidavit of Age Declaration</li>
              <li>Affidavit of Declaration of Marriage</li>
              <li>Affidavit of Death</li>
              <li>Affidavit of Loss of Sim Card</li>
              <li>Affidavit for Change of Vehicle Plate Number</li>
              <li>Affidavit of Change of Engine Number</li>
            </ul>
            <p><strong className="text-foreground">Turnaround Time:</strong> The expected turnaround time for affidavits is 15 minutes.</p>

            <p><strong className="text-foreground">3.2 Newspaper Publication Services</strong></p>
            <p>We offer the following publication types:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Name Change Publications (Affidavits and Marriage Certificate)</li>
              <li>Name Correction Publications (Affidavits and NIN)</li>
              <li>Loss of Documents Publication</li>
              <li>Public Announcements</li>
              <li>Congratulatory Messages (Graduation, weddings, promotion, anniversary celebrations, childbirth, etc.)</li>
            </ul>
            <p>
              <strong className="text-foreground">Turnaround Time:</strong> The expected turnaround time for newspaper
              publications is 24 hours or as scheduled by the particular newspaper.
            </p>

            <p><strong className="text-foreground">3.3 Digital Delivery</strong></p>
            <p>
              All documents are delivered electronically only. You will receive a Redemption Code to download your
              documents from our website. No physical documents are issued, and no office collection is available.
            </p>

            <p><strong className="text-foreground">3.4 Jurisdictions</strong></p>
            <p>We currently provide affidavit services for the following states:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Rivers State</li>
              <li>Abia State</li>
              <li>Enugu State</li>
            </ul>
          </Section>

          <Section title="4. User Accounts and Registration">
            <p>To use our Services, you must provide accurate and complete information, including:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">Compulsory:</strong> Phone number</li>
              <li><strong className="text-foreground">Optional:</strong> Email address</li>
            </ul>
            <p>
              You are solely responsible for maintaining the confidentiality of your Redemption Code and for all
              activities that occur under its use. You agree to notify us immediately of any unauthorized use of
              your Redemption Code. No user account creation is required to use our Services.
            </p>
          </Section>

          <Section title="5. User Conduct">
            <p>You agree to use our Services and website in compliance with all applicable laws and regulations. You must not:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide false, inaccurate, or misleading information.</li>
              <li>Use the Services for any unlawful, harmful, or fraudulent purposes.</li>
              <li>Upload or transmit any content that is defamatory, offensive, or violates the rights of any third party.</li>
              <li>Interfere with the operation of our website or attempt to gain unauthorized access to our systems.</li>
              <li>Use automated scripts or bots to access our platform.</li>
              <li>Attempt to circumvent any security measures we have in place.</li>
            </ul>
          </Section>

          <Section title="6. Payment Terms">
            <p><strong className="text-foreground">6.1 Pricing</strong></p>
            <p>All service prices are as listed on our website and are subject to change without prior notice. Current pricing includes:</p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[24rem] text-left text-sm">
                <thead className="bg-surface-elevated">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-foreground">Service</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Price (Naira)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-4 py-3">Affidavits — Rivers State (Port Harcourt)</td><td className="px-4 py-3">N3,500</td></tr>
                  <tr><td className="px-4 py-3">Affidavits — Abia State</td><td className="px-4 py-3">N3,000</td></tr>
                  <tr><td className="px-4 py-3">Name Change Publications</td><td className="px-4 py-3">N10,000</td></tr>
                  <tr><td className="px-4 py-3">Name Correction Publications</td><td className="px-4 py-3">N10,000</td></tr>
                  <tr><td className="px-4 py-3">Loss of Documents Publication (2x2)</td><td className="px-4 py-3">N60,000</td></tr>
                  <tr><td className="px-4 py-3">Public Announcements (2x2)</td><td className="px-4 py-3">N60,000</td></tr>
                  <tr><td className="px-4 py-3">Congratulatory Messages (2x2)</td><td className="px-4 py-3">N60,000</td></tr>
                </tbody>
              </table>
            </div>

            <p><strong className="text-foreground">6.2 Payment Gateway</strong></p>
            <p>
              All payments must be made through our payment gateways (Paystack or Flutterwave). We do not accept
              cash, bank transfers, or any other form of payment outside the designated gateways.
            </p>

            <p><strong className="text-foreground">6.3 Payment Confirmation</strong></p>
            <p>Services will only commence upon confirmation of successful payment. You will receive a payment confirmation notification via SMS and/or email.</p>

            <p><strong className="text-foreground">6.4 Referral Code</strong></p>
            <p>The referral code field is optional and not compulsory for completing your request.</p>
          </Section>

          <Section title="7. Redemption Code and Document Download">
            <p><strong className="text-foreground">7.1 Generation</strong></p>
            <p>Upon successful payment, a unique 4-digit alphanumeric Redemption Code will be generated and sent to you via SMS and email.</p>

            <p><strong className="text-foreground">7.2 Purpose</strong></p>
            <p>You will use this code to download your documents from the download field on our welcome page. No physical office visit is required to present the code.</p>

            <p><strong className="text-foreground">7.3 Validity Period</strong></p>
            <p>
              The Redemption Code is valid for one (1) year from the date of issuance. During this period, the code
              can be used multiple times to download the same document as long as it remains hosted in our database.
            </p>

            <p><strong className="text-foreground">7.4 Document Availability</strong></p>
            <p>
              Documents will be hosted on our secure servers for the 1-year validity period. After this period, the
              document may be archived or deleted, and the Redemption Code will no longer be valid.
            </p>
          </Section>

          <Section title="8. Intellectual Property">
            <p>
              All content on the PADDIMI MULTI CONCEPTS website, including but not limited to text, graphics, logos,
              images, software, and templates, is the property of PADDIMI MULTI CONCEPTS and is protected by Nigerian
              and international intellectual property laws. You may not:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Reproduce, distribute, or create derivative works from any content without our express written permission.</li>
              <li>Use our trademarks, logos, or brand name without prior written consent.</li>
              <li>Reverse engineer, decompile, or disassemble any software used in our platform.</li>
            </ul>
          </Section>

          <Section title="9. Service Limitations and Technical Failures">
            <p>
              PADDIMI MULTI CONCEPTS is committed to providing efficient services, but you acknowledge and agree that
              access to and use of our platform and the generation of documents are subject to limitations and potential
              interruptions due to circumstances beyond our reasonable control.
            </p>

            <p><strong className="text-foreground">9.1 System and Server Availability</strong></p>
            <p>
              Our Services, including the generation of redemption codes and documents, depend on the availability of
              our servers, hosting providers, internet services, and third-party software. We do not guarantee that the
              platform will be available at all times or that it will be error-free.
            </p>

            <p><strong className="text-foreground">9.2 Service Interruption (Force Majeure)</strong></p>
            <p>
              We will not be liable for any failure or delay in performing our obligations under these Terms if such
              failure or delay is due to a &quot;Force Majeure Event,&quot; which includes but is not limited to:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">Technical Failures:</strong> Server downtime, hardware or software malfunctions, network interruptions, power outages, or cyber-attacks (including DDoS and ransomware).</li>
              <li><strong className="text-foreground">Third-Party Failures:</strong> Downtime of the Judiciary website for generating affidavits; failures of our payment gateways (Paystack, Flutterwave), SMS provider (Termii), email service (Resend), cloud storage provider (Supabase), or any other third-party service we rely upon.</li>
              <li><strong className="text-foreground">Natural Events:</strong> Fire, flood, earthquake, storm, or other natural disasters.</li>
              <li><strong className="text-foreground">Regulatory Issues:</strong> Changes in government policy, court system operations, or regulatory requirements that affect our service delivery.</li>
              <li><strong className="text-foreground">Human Factors:</strong> Strikes, lockouts, labour disputes, or other industrial actions affecting our staff or service providers.</li>
              <li><strong className="text-foreground">Acts of War:</strong> War, terrorism, civil unrest, or other acts of violence.</li>
            </ul>

            <p><strong className="text-foreground">9.3 Failed Document Generation</strong></p>
            <p>In the event that a server failure or technical issue prevents the successful generation of your affidavit or document, we will take the following steps:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">Automatic Notification:</strong> You will receive an automated notification via SMS and/or email informing you of a technical delay.</li>
              <li><strong className="text-foreground">Manual Intervention:</strong> Our technical team will be notified to resolve the issue as quickly as possible. We will strive to restore service and complete your order within a reasonable time frame.</li>
              <li><strong className="text-foreground">Status Updates:</strong> Where possible, we will provide updates on the resolution progress via email or SMS.</li>
              <li><strong className="text-foreground">Full Refund:</strong> If we are unable to generate and deliver your document within 48 hours due to a confirmed system failure on our end, you will be offered a full refund of the service fee you paid.</li>
            </ul>

            <p><strong className="text-foreground">9.4 Redemption Code Repository and Data Backup</strong></p>
            <p>
              We will maintain a secure backup of all redemption codes and generated documents. This ensures that,
              even after a server failure, your document will remain available for download using your code for the
              stipulated 1-year period.
            </p>

            <p><strong className="text-foreground">9.5 Proactive Measures</strong></p>
            <p>We will implement reasonable security measures, including:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Regular data backups (daily).</li>
              <li>System monitoring and alerting.</li>
              <li>Load balancing to prevent server overload.</li>
              <li>Access controls and encryption.</li>
            </ul>
            <p>However, you agree that we are not liable for any loss of data that occurs despite our reasonable efforts.</p>

            <p><strong className="text-foreground">9.6 User Responsibility for Backup</strong></p>
            <p>
              We recommend that you download and save a copy of your document immediately upon receipt. We are not
              responsible for your failure to retain a copy of your documents.
            </p>
          </Section>

          <Section title="10. Disclaimers and Limitation of Liability">
            <p><strong className="text-foreground">10.1 No Legal Advice</strong></p>
            <p>
              The documents provided by us are for informational, administrative, and procedural purposes only. They
              are not a substitute for professional legal advice. We do not provide legal opinions, recommendations, or
              legal representation. You should consult a licensed attorney for legal advice specific to your situation.
              We are not responsible for any legal consequences arising from the use or misuse of our documents.
            </p>

            <p><strong className="text-foreground">10.2 User Responsibility for Information Accuracy</strong></p>
            <p>You are solely responsible for the accuracy and completeness of the information you provide. We are not liable for:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Errors, omissions, or legal consequences arising from incorrect, incomplete, or false user input.</li>
              <li>Rejection of documents by third parties (courts, government agencies, employers, etc.) due to inaccuracies in the information you provided.</li>
              <li>Failure to meet your specific requirements if you did not clearly communicate them.</li>
            </ul>

            <p><strong className="text-foreground">10.3 &quot;As-Is&quot; and &quot;As-Available&quot; Service</strong></p>
            <p>
              Our Services and platform are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              whether express, implied, or statutory. To the fullest extent permitted by law, we disclaim all warranties, including but not limited to:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
              <li>Warranties that the Services will be uninterrupted, error-free, secure, or free from viruses or other harmful components.</li>
              <li>Warranties that any errors will be corrected.</li>
            </ul>

            <p><strong className="text-foreground">10.4 Limitation of Liability</strong></p>
            <p>To the maximum extent permitted by applicable law, PADDIMI MULTI CONCEPTS, its officers, directors, employees, agents, and affiliates shall not be liable for:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Any indirect, incidental, special, consequential, or punitive damages.</li>
              <li>Any loss of profits, revenue, data, goodwill, or other intangible losses.</li>
              <li>Any damages arising from your use of or inability to use our Services; server unavailability, technical failures, or service interruptions (as detailed in Section 9); unauthorized access to or alteration of your information; statements or conduct of any third party on our platform; or any other matter relating to our Services.</li>
            </ul>
            <p>
              This limitation applies regardless of whether the claim is based on warranty, contract, tort (including
              negligence), or any other legal theory, and even if we have been advised of the possibility of such damages.
            </p>

            <p><strong className="text-foreground">10.5 Maximum Liability</strong></p>
            <p>
              In no event shall our total liability to you for all claims arising out of or relating to these Terms or
              your use of our Services exceed the total amount paid by you to us for the specific service giving rise to the claim.
            </p>

            <p><strong className="text-foreground">10.6 Legal Advice Disclaimer</strong></p>
            <p>
              You acknowledge that we do not guarantee that any affidavit or publication will be accepted by any court,
              government agency, or other entity. Acceptance is at the sole discretion of the receiving authority, and we
              bear no liability for rejection.
            </p>
          </Section>

          <Section title="11. Indemnification">
            <p>
              You agree to indemnify and hold harmless PADDIMI MULTI CONCEPTS, its officers, directors, employees, agents,
              and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, and
              expenses (including but not limited to reasonable attorney&apos;s fees) arising from:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Your use of and access to our Services.</li>
              <li>Your violation of any term of these Terms.</li>
              <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right.</li>
              <li>Any claim that your information, content, or conduct caused damage to a third party.</li>
              <li>Your violation of any applicable law or regulation.</li>
            </ul>
          </Section>

          <Section title="12. Termination">
            <p>
              We reserve the right to terminate or suspend your access to our Services immediately, without prior notice
              or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>
            <p>Upon termination:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Your right to use the Services will cease immediately.</li>
              <li>Your Redemption Code may be invalidated.</li>
              <li>We may retain your documents and data as required by law or for record-keeping purposes.</li>
            </ul>
          </Section>

          <Section title="13. Governing Law and Dispute Resolution">
            <p><strong className="text-foreground">13.1 Governing Law</strong></p>
            <p>These Terms shall be governed and construed in accordance with the laws of the Federal Republic of Nigeria.</p>

            <p><strong className="text-foreground">13.2 Dispute Resolution</strong></p>
            <p>Any dispute, controversy, or claim arising out of or relating to these Terms or your use of our Services shall be resolved in accordance with the following steps:</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li><strong className="text-foreground">Informal Resolution:</strong> You agree to first contact us directly at paddimi.mc@gmail.com to seek a resolution before resorting to formal dispute resolution.</li>
              <li><strong className="text-foreground">Negotiation:</strong> Both parties agree to negotiate in good faith to resolve the dispute.</li>
              <li><strong className="text-foreground">Mediation:</strong> If negotiation fails, the parties agree to submit the dispute to mediation before a neutral third-party mediator agreed upon by both parties.</li>
              <li><strong className="text-foreground">Arbitration or Litigation:</strong> If mediation fails, the dispute shall be submitted to the exclusive jurisdiction of the courts of Nigeria.</li>
            </ol>
          </Section>

          <Section title="14. Changes to Terms">
            <p>
              We reserve the right to update, modify, or replace these Terms at any time without prior notice. Any changes
              will be effective immediately upon posting on our website. It is your responsibility to review these Terms
              periodically for changes. Your continued use of the Services after any such changes constitutes your acceptance
              of the new Terms.
            </p>
          </Section>

          <Section title="15. Entire Agreement">
            <p>
              These Terms, together with our{' '}
              <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>{' '}
              and any other legal notices published on our website, constitute the entire agreement between you and
              PADDIMI MULTI CONCEPTS regarding your use of our Services. They supersede all prior or contemporaneous
              agreements, representations, warranties, or understandings, whether written or oral.
            </p>
          </Section>

          <Section title="16. Severability">
            <p>
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent
              jurisdiction, the remaining provisions shall continue in full force and effect. The invalid or unenforceable
              provision shall be deemed modified to the minimum extent necessary to make it enforceable.
            </p>
          </Section>

          <Section title="17. Waiver">
            <p>
              The failure of PADDIMI MULTI CONCEPTS to enforce any right or provision of these Terms shall not constitute
              a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if in
              writing and signed by an authorized representative of PADDIMI MULTI CONCEPTS.
            </p>
          </Section>

          <Section title="18. Contact Information">
            <p>If you have any questions about these Terms, please contact us at:</p>
            <ul className="list-none space-y-2">
              <li><strong className="text-foreground">Primary Email:</strong>{' '}<a href="mailto:paddimi.mc@gmail.com" className="text-brand-600 hover:underline">paddimi.mc@gmail.com</a></li>
              <li><strong className="text-foreground">Secondary Email:</strong>{' '}<a href="mailto:paddimi.mc@yahoo.com" className="text-brand-600 hover:underline">paddimi.mc@yahoo.com</a></li>
              <li><strong className="text-foreground">Website:</strong> paddimi.com</li>
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
