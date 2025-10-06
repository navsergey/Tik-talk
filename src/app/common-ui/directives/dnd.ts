import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: `[dnd]`
})
export class Dnd {
  // Директива делает любую область drop-зоной для перетаскивания файлов

  // Событие наружу: эмитим файл, когда пользователь «роняет» его на зону
  @Output() fileDropped = new EventEmitter<File>();

  // Привязываем css-класс к хост-элементу, чтобы подсвечивать зону во время наведения
  @HostBinding('class.fileover')
  fileover = false

  // Когда курсор с файлом над зоной — предотвращаем дефолтное поведение браузера
  // и помечаем зону активной (для визуальной подсветки)
  @HostListener('dragover', ['$event'])
  onDragover(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation();

    this.fileover = true;
  }

  // Когда курсор уходит с зоны — снимаем активное состояние
  @HostListener('dragleave', ['$event'])
  onDragleave(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation();

    this.fileover = false
  }

  // Когда файл «роняют» на зону — забираем первый файл и эмитим его наружу
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation();

    this.fileover = false

    // Если нужно поддержать множественный дроп — можно эмитить весь FileList
    this.fileDropped.emit(event.dataTransfer?.files[0])
  }
  }

