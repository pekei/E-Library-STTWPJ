export enum MemberStatus {
  ACTIVE = 'Jemaat Tetap',
  SYMPATHIZER = 'Simpatisan',
  INACTIVE = 'Tidak Aktif',
  MOVED = 'Pindah',
  DECEASED = 'Meninggal'
}

export enum FinanceType {
  INCOME = 'Pemasukan',
  EXPENSE = 'Pengeluaran'
}

export enum FinanceCategory {
  OFFERING_WEEKLY = 'Persembahan Minggu',
  TITHE = 'Perpuluhan',
  THANKSGIVING = 'Ucapan Syukur',
  MISSION = 'Misi & Diakonia',
  BUILDING = 'Pembangunan',
  OPERATIONAL = 'Operasional',
  SALARY = 'Gaji Staff/Pendeta',
  EVENT = 'Kegiatan',
  OTHER = 'Lain-lain'
}

export enum EventType {
  SERVICE = 'Ibadah Raya',
  YOUTH = 'Pemuda (Youth)',
  SUNDAY_SCHOOL = 'Sekolah Minggu',
  PRAYER = 'Doa Malam',
  MEETING = 'Rapat',
  SPECIAL = 'Acara Khusus'
}

export interface CongregationMember {
  id: string;
  name: string;
  nik?: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthDate: string;
  address: string;
  phone: string;
  status: MemberStatus;
  baptismDate?: string;
  familyCardNumber?: string;
  joinDate: string;
}

export interface FinanceRecord {
  id: string;
  date: string;
  type: FinanceType;
  category: FinanceCategory;
  amount: number;
  description: string;
  recordedBy: string; // User who recorded it
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: EventType;
}

export interface Stats {
  totalMembers: number;
  totalIncomeMonth: number;
  totalExpenseMonth: number;
  upcomingEvents: number;
}
