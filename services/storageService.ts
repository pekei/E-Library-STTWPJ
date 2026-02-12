import { CongregationMember, FinanceRecord, Event, MemberStatus, FinanceType, FinanceCategory, EventType } from '../types';

const KEYS = {
  MEMBERS: 'sim_gereja_members',
  FINANCE: 'sim_gereja_finance',
  EVENTS: 'sim_gereja_events',
};

// Seed Data if empty
const seedData = () => {
  if (!localStorage.getItem(KEYS.MEMBERS)) {
    const members: CongregationMember[] = [
      { id: 'J001', name: 'Yohanes Papare', gender: 'Laki-laki', birthDate: '1980-05-15', address: 'Jl. Sentani No. 10', phone: '08123456789', status: MemberStatus.ACTIVE, joinDate: '2010-01-01', baptismDate: '2010-12-25' },
      { id: 'J002', name: 'Maria Wally', gender: 'Perempuan', birthDate: '1985-08-20', address: 'Jl. Abepura No. 5', phone: '08129876543', status: MemberStatus.ACTIVE, joinDate: '2012-03-15' },
      { id: 'J003', name: 'Petrus Wenda', gender: 'Laki-laki', birthDate: '1995-11-10', address: 'Jl. Waena No. 12', phone: '082133445566', status: MemberStatus.SYMPATHIZER, joinDate: '2023-01-10' },
    ];
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
  }

  if (!localStorage.getItem(KEYS.FINANCE)) {
    const finance: FinanceRecord[] = [
      { id: 'F001', date: new Date().toISOString().split('T')[0], type: FinanceType.INCOME, category: FinanceCategory.OFFERING_WEEKLY, amount: 5000000, description: 'Persembahan Minggu I', recordedBy: 'Bendahara' },
      { id: 'F002', date: new Date().toISOString().split('T')[0], type: FinanceType.EXPENSE, category: FinanceCategory.OPERATIONAL, amount: 1500000, description: 'Bayar Listrik & Air', recordedBy: 'Bendahara' },
    ];
    localStorage.setItem(KEYS.FINANCE, JSON.stringify(finance));
  }
  
  if (!localStorage.getItem(KEYS.EVENTS)) {
    const events: Event[] = [
        { id: 'E001', title: 'Ibadah Raya Minggu', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '09:00', location: 'Gedung Gereja Utama', description: 'Ibadah Raya Minggu Pagi', type: EventType.SERVICE },
        { id: 'E002', title: 'Persekutuan Pemuda', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '18:00', location: 'Aula Serbaguna', description: 'Ibadah Kaum Muda', type: EventType.YOUTH },
    ];
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  }
};

seedData();

export const StorageService = {
  getMembers: (): CongregationMember[] => JSON.parse(localStorage.getItem(KEYS.MEMBERS) || '[]'),
  saveMembers: (members: CongregationMember[]) => localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members)),

  getFinanceRecords: (): FinanceRecord[] => JSON.parse(localStorage.getItem(KEYS.FINANCE) || '[]'),
  saveFinanceRecords: (records: FinanceRecord[]) => localStorage.setItem(KEYS.FINANCE, JSON.stringify(records)),

  getEvents: (): Event[] => JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]'),
  saveEvents: (events: Event[]) => localStorage.setItem(KEYS.EVENTS, JSON.stringify(events)),
};
