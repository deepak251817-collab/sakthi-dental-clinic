# Client Content Notes

Genuine observations about the supplied client content and open items that
need the client's (or the internship coordinator's) confirmation. Nothing
here is invented; each item records what the brief says and what the site
does about it.

## Operating-hours discrepancy

The client brief contains two different availability timings:

* The **Contact page content** specifies: *"Sunday to Saturday: 9 AM to 7 PM"*.
* Another reference in the brief mentions *9 AM–9 PM*.

**Decision taken (per the Phase 7 instructions):** the implementation uses
**9 AM–7 PM** for the Contact page and the structured data (the JSON-LD
`OpeningHoursSpecification` encodes `09:00–19:00`), because that is the
explicit Contact-page timing. The Home facility highlight says
**"Doctors available daily"** and avoids printing a conflicting hour.

**Needs client confirmation:** the actual daily operating hours before
production launch. If the clinic confirms 9 AM–9 PM, the Contact page,
JSON-LD and this note must be updated together.

## Client-provided image dependency

The brief supplies a Drive folder of clinic photos and permits
copyright-free imagery. The repository currently ships copyright-safe
placeholder assets, and the gallery explicitly documents that the client's
real photos can be dropped into `public/images/gallery/` with the same
filenames to go live.

**Needs client confirmation / delivery:** the actual photo set, plus
permission to publish it on the clinic's public website.

## Testimonials

Testimonial quotes and first names come from the client brief. They are
reproduced as supplied; no additional testimonials were invented.

**Needs client confirmation:** that the named patients consent to
publication, and whether full names/photos should be shown.

## Appointment handling

The original brief describes appointment CTAs handled by the clinic's web
team (phone confirmation). The implementation follows that model: the form
creates a **request** stored as `PENDING` and the admin dashboard workflow
exists precisely so staff can confirm by phone. Nothing is auto-booked and
the UI says so in plain language.

## Doctor credentials

Doctor cards show only the name, role and focus line supplied in the brief.
Degrees, years of experience, registrations and affiliations were **not**
invented and remain blank until the clinic supplies verifiable details.

## Items requiring client confirmation before launch

* Final operating hours (see discrepancy above)
* Real photography and publication permission
* Testimonial consent
* Doctor credential details
* Final production domain (canonical URLs, sitemap and Open Graph
  metadata currently use `https://sakthidentalclinic.in` from the brief)
