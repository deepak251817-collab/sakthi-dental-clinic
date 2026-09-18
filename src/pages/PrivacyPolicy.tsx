import Container from '../components/common/Container'
import PageHero from '../components/common/PageHero'
import { site } from '../lib/constants'
import SEO from '../components/seo/SEO'

const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'When you use our website or contact us, we may collect personal information that you choose to share with us, such as your name, email address, phone number and the content of any message you send through our contact form.',
      'Like most websites, we may also receive standard technical information automatically, such as your browser type, device type and the pages you visit on this site.',
    ],
  },
  {
    title: '2. Cookies',
    body: [
      'This website may use small text files called cookies to understand how visitors use the site and to improve your browsing experience. Cookies do not give us access to your computer or any personal information beyond what you choose to share with us.',
      'You can choose to accept or decline cookies through your browser settings. Declining cookies may affect some parts of your experience on this site.',
    ],
  },
  {
    title: '3. How We Use Your Information',
    body: [
      'We use the information you provide to respond to your enquiries, schedule appointments you request, and communicate with you about your dental care.',
      'We do not sell, trade or otherwise transfer your personal information to outside parties. We may use aggregated, non-identifying information to understand how our website is used and to improve its content.',
    ],
  },
  {
    title: '4. Data Security',
    body: [
      'We are committed to keeping your personal information safe. We take reasonable technical and organizational precautions to protect the information we collect from loss, misuse or unauthorized access.',
      'Please remember that no method of transmission over the internet is completely secure, and we cannot guarantee absolute security of information shared online.',
    ],
  },
  {
    title: '5. Information Sharing',
    body: [
      'We do not share your personal information with third parties except where it is necessary to provide you with a service you have requested, where we are legally required to do so, or where it is necessary to protect the safety of our patients and staff.',
    ],
  },
  {
    title: "6. Children's Privacy",
    body: [
      'We are committed to protecting the privacy of children. This website is not directed at collecting personal information from children, and we do not knowingly collect personal information from children without consent from a parent or guardian.',
      'If you believe a child has provided us with personal information, please contact us so we can remove it promptly.',
    ],
  },
  {
    title: '7. Changes to This Policy',
    body: [
      'We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page, and the revised policy will apply from the date of posting.',
      'We encourage you to review this page periodically to stay informed about how we protect your information.',
    ],
  },
  {
    title: '8. Acceptance of Terms',
    body: [
      'By using this website, you signify your acceptance of this privacy policy. If you do not agree with this policy, please do not use our website.',
      'Your continued use of the website following the posting of changes to this policy will be deemed your acceptance of those changes.',
    ],
  },
  {
    title: '9. Contact Us',
    body: [
      `If you have any questions about this privacy policy or how we handle your information, please reach out to us at ${site.email} or call us on ${site.phones[0]} / ${site.phones[1]}.`,
      'You can also visit us at the clinic:',
      `${site.address.line1} ${site.address.line2}`,
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy | Sakthi Dental Clinic"
        description="Read the Sakthi Dental Clinic website privacy policy."
        path="/privacy-policy"
      />
      <PageHero
        title="Privacy Policy"
        subtitle="How Sakthi Dental Clinic collects, uses and protects your information."
      />

      <section className="py-16 sm:py-20" aria-label="Privacy policy content">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="text-xl font-bold text-ink-800">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-slate-500">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
