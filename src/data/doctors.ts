export interface Doctor {
  name: string
  role: string
  focus: string
}

/**
 * Doctor roster supplied by the client. No degrees, years, certifications or
 * affiliations are claimed — only the names and roles provided in the brief.
 */
export const doctors: Doctor[] = [
  {
    name: 'Dr. Anupriya',
    role: 'Founder',
    focus: 'Personalized, comfortable dental care for every patient',
  },
  {
    name: 'Dr. Ananya Iyer',
    role: 'Prosthodontist',
    focus: 'Dentures, bridges and full-mouth restoration',
  },
  {
    name: 'Dr. Meera Subramanian',
    role: 'Endodontist',
    focus: 'Root canal therapy and saving natural teeth',
  },
  {
    name: 'Dr. Arvind Kumar',
    role: 'Dental Surgeon',
    focus: 'Extractions and everyday surgical care',
  },
  {
    name: 'Dr. Sneha N',
    role: 'Orthodontist',
    focus: 'Braces and teeth alignment for all ages',
  },
  {
    name: 'Dr. Srinivas Rohit Ramanujam',
    role: 'Implantologist',
    focus: 'Dental implants and fixed tooth replacement',
  },
  {
    name: 'Dr. Balu',
    role: 'Laser Surgeon',
    focus: 'Minimally invasive laser dentistry',
  },
  {
    name: 'Dr. Vikram Raj Kishore',
    role: 'Aligners Partner',
    focus: 'Clear aligner treatment planning',
  },
  {
    name: 'Dr. Ajay Jumar',
    role: 'Oral & Maxillofacial Surgeon',
    focus: 'Advanced oral and facial surgical care',
  },
]
