import {Profile} from './profile.interface';

export  interface Pageble<T> {
  items: T[]; //Массива Profile'ов
  total: number;
  page: number;
  size: number;
  pages: number;
}
