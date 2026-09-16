export interface AppointmentRequest {
  name: string
  phone: string
  email: string
  preferredDate?: string
  preferredTime?: string
  treatment?: string
  message?: string
}

export interface AppointmentFormErrors {
  name?: string
  phone?: string
  email?: string
  preferredDate?: string
}

export type SubmissionStatus = 'idle' | 'submitting' | 'success'
