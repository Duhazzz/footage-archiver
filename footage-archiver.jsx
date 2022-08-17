var thisProject = app.project;
var prefixRGB = "/rgb_";
var prefixAlpha = "/alpha_";
var arrayRgbFootages=[];
var arrayAlphaFootages=[];
var unusedFootages=[];
var nameConvertFolder = "convert into mpeg";
var messageNoWay = "Без пути к папке скрипт не работает";
var workFootages = [];
var compsForRender = [];
var compsWithAlphaForRender =[];
var checkRenderRGB = false;
var checkRenderAlphas = false;
var checkAllRenders = false;
var checkImport = 0;
var importFolder = new Folder;
var userRenderFilesPath;
var userRenderFiles;
var userRenderFilesString;
var additionalRender=[];
var additionalRenderNames="";
var importFootageRGB=[];
var importFootageAlpha=[];
var messageDontRender="Кажется не всё отрендерилось. Недостающие композиции отправлены в очередь рендера. Этих композиции нет в папке:";
if(app.settings.haveSetting("collect script","Check")){
    var saveRenderPath = app.settings.getSetting("collect script","Check");
}
var renderCompName="";
//////////////////////////////////////////////////////////
app.beginUndoGroup("precomp footages");
getInfoAboutFootages();
/*
var workFootagesList=getNameFootages(workFootages).toString();
alert(workFootagesList.replace(",","????"));*/
if(unusedFootages[0]!=null){
    alert(getNameFootages(unusedFootages),"Футажи которых нет в композициях не будут пересчитаны")
}
//1 отправить футажи в очередь на рендер
getRenderFolder();
if(userRenderFilesPath!=null){
if(findItem(nameConvertFolder)==false){
    for (var i = 0; i < workFootages.length; i++)
    {workFootages[i].name=removeExtension(workFootages[i].name)}
    precompWithReplace(workFootages);
    sendForRender(compsForRender,prefixRGB);
    alert("Все футажи поставлены в очередь рендера, отрендерите их. После запустите скрипт снова", "Первый этап пройден");
}else{
//2 сравнить имена RGB композиций с отрендеренныими именами файлов в папке
compareLists(workFootages,prefixRGB,1);
//3 отправить альфа каналы в очередь на рендер
if(checkRenderRGB==true){
//4 сравнить имена альфа композиции с отрендеренныими именами файлов в папке
compareLists(arrayAlphaFootages,prefixAlpha,0);
}
}
}else{alert(messageNoWay)}
app.endUndoGroup();
////////////////////////////////////////////////
function compareLists(array,prefix,indecator){//сравниваем массив футажей с просчитанными файлами
    
    userRenderFiles=userRenderFilesPath.getFiles();
    userRenderFiles=File.decode(userRenderFiles).toString();
    for (var i = 0; i < array.length; i++)
    {
        if(userRenderFiles.indexOf(prefix+removeExtension(array[i].name))==-1)
        {
            additionalRender.push(getCompFromFootage(array[i]));
        }
    }
    getRenderList(array,prefix,indecator);
}
function getRenderList(array,prefix,indecator){//получить список композиций отправляемых на рендер
        if((additionalRender.length!=0)&&(additionalRender.length!=array.length))
    {
        additionalRenderNames=getNameFootages(additionalRender);
        additionalRenderNames=additionalRenderNames.toString();
        alert(messageDontRender+" "+additionalRenderNames);
        sendForRender(additionalRender,prefix);
    }
    else if(additionalRender.length==array.length)
    {
        if(checkRenderRGB==false)
        {
           sendForRender(additionalRender,prefixRGB);
        }
        if(checkRenderRGB==true)
        {
            sendForRender(additionalRender,prefixAlpha);
        }
    }
    else{checkRenderRGB=true;}
    if((additionalRender.length==0)&&(indecator==0)){
        importUserFootages();
    }
}
function getInfoAboutFootages(){//блок определение футажей для замены
    for(var i = 1; i <= thisProject.items.length; i++){//цикл проходящий по всем обьектам в проекте
        if(thisProject.items[i].mainSource){//если файл импортирован
            if(thisProject.items[i].mainSource.isStill){}
                else{//если файл не картинка
                    if(thisProject.items[i].hasVideo){
                    if(thisProject.items[i].usedIn!=""){//проверка слоя на присудствие в другой композиции
                    if(thisProject.items[i].mainSource.hasAlpha){
                        arrayAlphaFootages.push(thisProject.items[i]);//получаем массив футажей с альфой
                    }
                    else{
                        arrayRgbFootages.push(thisProject.items[i]);//получаем массив футажей без альфы
                    }
                    
                    
                }else{//получаем массивы которые не используются в других композициях
                    unusedFootages.push(thisProject.items[i]);
                }
            }}
        }
    }
    workFootages=arrayRgbFootages.concat(arrayAlphaFootages);
}
function findItem(nameItem){
    var boolvalue=false;
    for (var i = 1; i < thisProject.items.length; i++)
          {
            if(thisProject.items[i].name==nameItem){
                boolvalue=true;
                return boolvalue;
            }
          }
         return boolvalue;
}
function precompWithReplace(array){//прекомп с заменой
var convertFolder = thisProject.items.addFolder(nameConvertFolder);    
var selectionItems = array;
var nameCounter = 1;
for (var i = 0; i < selectionItems.length; i++)
          {
                var compsUsedIn = selectionItems[i].usedIn;
                var thisName = selectionItems[i].name;
                for (var y = i+1; y < selectionItems.length; y++)
                {//изменяем имя композиции если есть дубликат
                    if(thisName==selectionItems[y].name)
                    {
                        thisName=thisName+"_"+nameCounter;
                        nameCounter++;
                    }
                }
                thisName=thisName.replace(/\//gi,"_");//удаляем косые черты из имени композиции
                thisName=thisName.replace(/\./gi,"_");//удаляем точки из имени композиции
                var newComp = thisProject.items.addComp(thisName, selectionItems[i].width, selectionItems[i].height, selectionItems[i].pixelAspect, selectionItems[i].duration, selectionItems[i].frameRate);
                compsForRender.push(newComp);
                if(selectionItems[i].mainSource.hasAlpha){compsWithAlphaForRender.push(newComp);}
                newComp.parentFolder = convertFolder;
                newComp.layers.add(selectionItems[i]);
                for (var x = 0; x < compsUsedIn.length; x++)
                     {
                               var layersInComp = compsUsedIn[x].numLayers;
                              for (var y = 1; y <= layersInComp; y++)
                                   {
                                             if (compsUsedIn[x].layer(y).source == selectionItems[i]) {
                                                       compsUsedIn[x].layer(y).replaceSource(newComp, true);
                                        }
                              }
                    }
          }
          
        }
function sendForRender(array,prefix){//отправка на рендер
    if(thisProject.renderQueue.numItems>0)//обнуляем очередь рендера
    {alert(thisProject.renderQueue.numItems);
        for (var i = thisProject.renderQueue.numItems; i >= 1; i--)
        {
            thisProject.renderQueue.item(i).remove();
        } 
    }
    userRenderFilesPath=userRenderFilesPath.toString();
    for (var i = 0; i < array.length; i++)//отправить композиции на рендер в очередь
          {
            thisProject.renderQueue.items.add(array[i]);
            renderCompName=prefix+thisProject.renderQueue.items[i+1].comp.name;
            thisProject.renderQueue.items[i+1].outputModule(1).file = File(userRenderFilesPath+renderCompName);
          }
}
function getNameFootages(array){//получить имена футажей из массива
    var nameFootages=[];
    for (var i = 0; i < array.length; i++)
    {
        nameFootages.push(array[i].name);
    }   
    return nameFootages;
}
function replaceFootages(array){//заменяем футажи
    for (var i = 0; i < array.length; i++)
    {
        array[i].replace(file)
    }  
}
function getRenderFolder(){//alert();
    userRenderFilesPath = Folder.selectDialog('Choose folder for render');
    //app.settings.saveSetting("collect script","Check",userRenderFilesPath);
}
function getCompFromFootage(footage){
    return footage.usedIn[0];
}
function removeExtension(filename) {//удалить расширение файла сохраненное в имени композиции
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
}
function getAlphaComps(){
    for (var i = 0; i < arrayAlphaFootages.length; i++)
    {
        if(arrayAlphaFootages[i].usedIn)
        {;
            compsWithAlphaForRender.push(arrayAlphaFootages[i].usedIn[0]);
            //alert(compsWithAlphaForRender[0].name);
        };
    }
}
function importUserFootages(){
    checkAllRenders=true;
    if(checkImport==0){
        checkImport++;
        userRenderFiles=userRenderFilesPath.getFiles();//еще массив, 
        userRenderFilesString=File.decode(userRenderFiles).toString();
        var newFootagesFolder = thisProject.items.addFolder("new footages");
        var newFootage;
        //импорт футажей в проект
        for (var i = 0; i < userRenderFiles.length; i++)
        {
            newFootage=thisProject.importFile(new ImportOptions(File(userRenderFiles[i])));
            newFootage.parentFolder = newFootagesFolder;
            //alert(newFootage.name);
            if(newFootage.name.indexOf(prefixRGB.slice(1))!=-1)
            {
                importFootageRGB.push(newFootage);
            }
            if(newFootage.name.indexOf(prefixAlpha.slice(1))!=-1)
            {
                importFootageAlpha.push(newFootage);
            }
        }
        for (var j = 0; j < workFootages.length; j++)
        {
            compsForRender.push(getCompFromFootage(workFootages[j]));
            workFootages[j].remove();
        }
        for (var i = 0; i < compsForRender.length; i++)
        {
            for (var j = 0; j < importFootageRGB.length; j++)
            {
                if(importFootageRGB[j].name.indexOf(removeExtension(compsForRender[i].name))!=-1)
                {
                    compsForRender[i].layers.add(importFootageRGB[j]);
                    compsForRender[i].layer(importFootageRGB[j].name.toString()).trackMatteType=TrackMatteType.LUMA;
                }    
            }
            for (var j = 0; j < importFootageAlpha.length; j++)
            {
                if(importFootageAlpha[j].name.indexOf(removeExtension(compsForRender[i].name))!=-1)
                {
                    compsForRender[i].layers.add(importFootageAlpha[j]);
                    compsForRender[i].layer(importFootageAlpha[j].name.toString()).enabled=false;
                }    
            }
        }
        
        
    }
}
//created by duhazzz