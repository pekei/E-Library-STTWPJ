import { Book, Member, Loan, Category } from '../types';

const KEYS = {
  BOOKS: 'stt_library_books',
  MEMBERS: 'stt_library_members',
  LOANS: 'stt_library_loans',
};

// Seed Data if empty
const seedData = () => {
  if (!localStorage.getItem(KEYS.BOOKS)) {
    const books: Book[] = [
      { id: '1', isbn: '978-0123456789', title: 'Sistematika Teologi Vol 1', author: 'Louis Berkhof', publisher: 'Momentum', year: 2010, category: Category.THEOLOGY, stock: 5, available: 4 },
      { id: '2', isbn: '978-9876543210', title: 'Tafsir Injil Matius', author: 'Matthew Henry', publisher: 'BPK Gunung Mulia', year: 2005, category: Category.BIBLICAL_STUDIES, stock: 3, available: 3 },
      { id: '3', isbn: '978-1122334455', title: 'Sejarah Gereja Asia', author: 'Dr. Anne R', publisher: 'Kanisius', year: 2018, category: Category.HISTORY, stock: 2, available: 1 },
    ];
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
  }

  if (!localStorage.getItem(KEYS.MEMBERS)) {
    const members: Member[] = [
      { id: 'MHS2023001', name: 'Yohanes Papare', type: 'Mahasiswa', email: 'yohanes@stt.ac.id', phone: '08123456789', joinDate: '2023-08-01' },
      { id: 'DSN001', name: 'Dr. Paulus W', type: 'Dosen', email: 'paulus@stt.ac.id', phone: '08129876543', joinDate: '2020-01-15' },
    ];
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
  }
  
  if (!localStorage.getItem(KEYS.LOANS)) {
      // Seed one active loan
      const loans: Loan[] = [
           { id: 'L-1001', bookId: '1', memberId: 'MHS2023001', loanDate: new Date().toISOString(), dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'active' }
      ];
      localStorage.setItem(KEYS.LOANS, JSON.stringify(loans));
  }
};

seedData();

// In-memory cache
let cachedBooks: Book[] | null = null;
let cachedMembers: Member[] | null = null;
let cachedLoans: Loan[] | null = null;

export const StorageService = {
  getBooks: (): Book[] => {
    if (!cachedBooks) {
      cachedBooks = JSON.parse(localStorage.getItem(KEYS.BOOKS) || '[]');
    }
    return cachedBooks!;
  },
  saveBooks: (books: Book[]) => {
    cachedBooks = books;
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
  },

  getMembers: (): Member[] => {
    if (!cachedMembers) {
      cachedMembers = JSON.parse(localStorage.getItem(KEYS.MEMBERS) || '[]');
    }
    return cachedMembers!;
  },
  saveMembers: (members: Member[]) => {
    cachedMembers = members;
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
  },

  getLoans: (): Loan[] => {
    if (!cachedLoans) {
      cachedLoans = JSON.parse(localStorage.getItem(KEYS.LOANS) || '[]');
    }
    return cachedLoans!;
  },
  saveLoans: (loans: Loan[]) => {
    cachedLoans = loans;
    localStorage.setItem(KEYS.LOANS, JSON.stringify(loans));
  },
};