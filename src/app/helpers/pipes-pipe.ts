import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipes'
})
export class PipesPipe implements PipeTransform {

  transform(value: string | null): string | null{
    if (!value) return null
    return `https://icherniakov.ru/yt-course/${value}`;
  }

}
