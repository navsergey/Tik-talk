import {Component, signal} from '@angular/core';
import {SvgIcon} from '../../../common-ui/svg-icon/svg-icon';
import {Dnd} from '../../../common-ui/directives/dnd';
import {FormsModule} from '@angular/forms';

@Component({
  // Компонент загрузки аватара: поддерживает dnd и выбор файла через input
  selector: 'app-avatar-upload',
  // Импортируем иконку и директиву dnd для drop-зоны
  imports: [
    SvgIcon,
    Dnd,
    FormsModule
  ],
  templateUrl: './avatar-upload.html',
  styleUrl: './avatar-upload.scss'
})
export class AvatarUpload {
  // Сигнал с превью-картинкой (по умолчанию плейсхолдер)
  preview = signal<string>('/assets/imgs/img-placeholder.png')

  avatar:File | null = null


  // Обработка выбора файла через <input type="file">
  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0]
    this.processFiles(file)


  }


  // Обработка файла, полученного из dnd-директивы
  onFileDroped(file: File) {
    this.processFiles(file)
  }


  // Общая обработка файла: валидация и чтение как DataURL для превью
  processFiles(file:File | null | undefined) {

    // Пропускаем, если нет файла или тип не изображение
    if(!file || !file.type.match('image')) return;

    const reader = new FileReader();

    // Когда файл прочитан — записываем dataURL в сигнал превью
    reader.onload = event => {
      this.preview.set(event.target?.result?.toString() ?? '')
    };

    reader.readAsDataURL(file)
    this.avatar = file
  }

}
