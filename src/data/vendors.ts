import type { Vendor } from '../components/LedgerTable'

export const vendors: Vendor[] = [
  {
    name: 'Amazon Web Services',
    category: 'Cloud Infrastructure',
    categoryVariant: 'outline',
    contact: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@company.com',
      phone: '+1 (555) 019-2834',
    },
    credentials: [
      { label: 'ACCOUNT ID', value: 'AWS-8829-1022' },
      { label: 'ROOT PASSWORD', value: 'Sup3rS3cur3!Pw', isPassword: true, maskLength: 12 },
    ],
    billing: {
      cycle: 'Net 30',
      renewalNote: 'Renews 1st of month',
    },
    monthlyCost: '$18,450.00',
  },
  {
    name: 'Figma',
    category: 'Design Software',
    categoryVariant: 'filled',
    contact: {
      name: 'Marcus Chen',
      email: 'marcus@company.com',
    },
    credentials: [
      { label: 'SSO INTEGRATED', value: 'Via Okta' },
    ],
    billing: {
      cycle: 'Annual',
      renewalNote: 'Renews Oct 14',
    },
    monthlyCost: '$2,400.00',
  },
  {
    name: 'Zendesk',
    category: 'Customer Support',
    categoryVariant: 'outline',
    contact: {
      name: 'Elena Rostova',
      email: 'elena.r@company.com',
    },
    credentials: [
      { label: 'ADMIN LOGIN', value: 'support-admin@company.com' },
      { label: 'PASSWORD', value: 'Zd3sk!Admin', isPassword: true, maskLength: 8 },
    ],
    billing: {
      cycle: 'Monthly',
    },
    monthlyCost: '$850.00',
  },
  {
    name: 'Mailchimp',
    category: 'Marketing',
    categoryVariant: 'filled',
    contact: {
      name: 'David Kim',
      email: 'david@company.com',
    },
    credentials: [
      { label: 'ACCOUNT ID', value: 'MC-992-B' },
      { label: 'PASSWORD', value: 'Mc!M4rk3t1ng', isPassword: true, maskLength: 14 },
    ],
    billing: {
      cycle: 'Monthly',
    },
    monthlyCost: '$320.00',
  },
]
