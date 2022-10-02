# footage-archiver
rus<br>
Для чего этот скрипт
Скрипт для уменьшения веса проекта. Запускаешь его и он пересчитывает все футажи в мпеги(или другой формат привычный пользователю). Скрипт загоняет все футажи в прекомпы с заменой оригинала. Футажи с альфой тоже учитываются для них создается два мпега, один мпег оригинальный, второй черно белый (рендер альфы). Если в процессе просчета возникли проблемы(например, вылетел комп), скрипт при запуске сделает сверку списков композиций и отрендеренных файлов и недостающие файлы отправит в очередь. После того как все просчиталось и заменилось можно коллектить проект. Итого я смог свой проект из 250 гб, ужать в 10гб.

Как работать со скриптом.
Создайте копию проекта с которым будете работать, на всякий случай
Откройте проект, запустите скрипт
Каждый раз после запуска скрипта будет запрашиваться папка для рендера, в рамках одного проекта это всегда должна бать одна папка.
Скрипт пройдется по вашим футажам и поместит их в прекомпозы с заменой, создаст папку "convert into mpeg", все прекомпозы будут в ней. Тут же скрипт отправит всю папку на рендер. В имени файлов должна быть подпись "rgb_". Здесь пользователь должен настроить все файлы в нужный ему формат в RGB без альфы и посчитать в Ае, либо в encoder.
После просчета первой партии файлов снова запускайте скрипт(внутри того же проекта конечно же). Если посчиталось не всё недосчитанные файлы снова отправятся в очередь.
Если все файлы RGB просчитались, в очередь отправятся файлы с припиской "alpha_". Тут пользователь должен настроить рендер на просчет альфы.
В случае недорендера должен сработать тот же алгоритм что и с "RGB".
Когда все файлы будут просчитаны вы в последний раз запустите скрипт. Все футажи в прекомпозах заменятся на отрендеренные файлы.
Чем больше футажей в проекте тем сильнее подвисает Ае в процессе работы с файлами.

Есть функционал который бы я хотел поменять, но мне не хватает знаний:
Запомнить путь до папки для рендера и спрашивать его только один раз в рамках одного проекта.
Что-то ещё хотел изменить, но забыл что, потом допишу.

eng<br>
What is this script for?
Script to reduce the weight of the project. You run it and it recalculates all the footage in mpegs (or another format familiar to the user). The script drives all the footage into precomps with the replacement of the original. Footages with alpha are also taken into account for them, two mpeg are created, one mpeg is original, the second is black and white (rendering alpha). If there were problems during the rendering process (for example, the computer crashed), the script will check the lists of compositions and rendered files at startup and send the missing files to the queue. After everything has been calculated and replaced, you can collect the project. In total, I was able to shrink my project from 250 GB to 10 GB.

How to work with a script.
Create a copy of the project you will be working with, just in case
Open the project, run the script
Each time after the script is launched, a folder for rendering will be requested, within the framework of one project it should always be one folder.
The script will go through your footage and put them in precompos with replacement, create a folder "convert into mpeg", all precompos will be in it. Immediately the script will send the entire folder to render. The file name must contain the signature "rgb_". Here the user must set all the files to the format he needs in RGB without alpha and calculate in Ae, or in the encoder.
After rendering the first batch of files, run the script again (within the same project, of course). If not all uncounted files were counted, they will be sent to the queue again.
If all RGB files are miscalculated, files with "alpha_" will be sent to the queue. Here the user must set the render to calculate the alpha.
In the case of under-rendering, the same algorithm should work as with "RGB".
When all files are calculated, you will run the script for the last time. All footage in precomposites will be replaced with rendered files.
The more footages in the project, the more Ae freezes while working with files.

There is a functionality that I would like to change, but I do not have enough knowledge:
Remember the path to the render folder and ask for it only once within one project.
I wanted to change something else, but I forgot what, I'll add it later.
