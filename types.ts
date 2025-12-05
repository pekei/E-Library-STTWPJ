export enum Category {
  THEOLOGY = 'Teologi',
  BIBLICAL_STUDIES = 'Studi Alkitab',
  MINISTRY = 'Pelayanan',
  HISTORY = 'Sejarah Gereja',
  GENERAL = 'Umum',
  REFERENCE = 'Referensi'
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  category: Category;
  stock: number;
  available: number;
}

export interface Member {
  id: string; // NIM or NIDN
  name: string;
  type: 'Mahasiswa' | 'Dosen' | 'Staff';
  email: string;
  phone: string;
  joinDate: string;
}

export interface Loan {
  id: string;
  bookId: string;
  memberId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface Stats {
  totalBooks: number;
  activeMembers: number;
  activeLoans: number;
  overdueLoans: number;
}