define(["libraryBrowser","cardBuilder","appSettings","components/groupedcards","dom","apphost","imageLoader","scrollStyles","emby-button","paper-icon-button-light","emby-itemscontainer"],function(libraryBrowser,cardBuilder,appSettings,groupedcards,dom,appHost,imageLoader){"use strict";function getUserViews(userId){return ApiClient.getUserViews({},userId).then(function(result){return result.Items})}function enableScrollX(){return browserInfo.mobile}function getSquareShape(){return enableScrollX()?"overflowSquare":"square"}function getThumbShape(){return enableScrollX()?"overflowBackdrop":"backdrop"}function getPortraitShape(){return enableScrollX()?"overflowPortrait":"portrait"}function getLibraryButtonsHtml(items){for(var html="",i=0,length=items.length;i<length;i++){var icon,item=items[i];switch(item.CollectionType){case"movies":icon="local_movies";break;case"music":icon="library_music";break;case"photos":icon="photo";break;case"livetv":icon="live_tv";break;case"tvshows":icon="live_tv";break;case"games":icon="folder";break;case"trailers":icon="local_movies";break;case"homevideos":icon="video_library";break;case"musicvideos":icon="video_library";break;case"books":icon="folder";break;case"channels":icon="folder";break;case"playlists":icon="folder";break;default:icon="folder"}var cssClass="card smallBackdropCard buttonCard";item.CollectionType&&(cssClass+=" "+item.CollectionType+"buttonCard");var href=item.url||libraryBrowser.getHref(item),onclick=item.onclick?' onclick="'+item.onclick+'"':"";icon=item.icon||icon,html+="<a"+onclick+' data-id="'+item.Id+'" class="'+cssClass+'" href="'+href+'" style="min-width:12.5%;">',html+='<div class="cardBox '+cardBuilder.getDefaultColorClass(item.Name)+'" style="margin:4px;">',html+="<div class='cardText'>",html+='<i class="md-icon">'+icon+"</i>",html+='<span style="margin-left:.7em;">'+item.Name+"</span>",html+="</div>",html+="</div>",html+="</a>"}return html}function loadlibraryButtons(elem,userId,index){return getUserViews(userId).then(function(items){var html="<br/>";return index&&(html+='<h1 class="listHeader">'+Globalize.translate("HeaderMyMedia")+"</h1>"),html+='<div style="display:flex;flex-wrap:wrap;">',html+=getLibraryButtonsHtml(items),html+="</div>",getAppInfo().then(function(infoHtml){elem.innerHTML=html+infoHtml})})}function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}function getAppInfo(){var frequency=864e5;AppInfo.isNativeApp&&(frequency=1728e5);var cacheKey="lastappinfopresent5",lastDatePresented=parseInt(appSettings.get(cacheKey)||"0");return lastDatePresented?(new Date).getTime()-lastDatePresented<frequency?Promise.resolve(""):Dashboard.getPluginSecurityInfo().then(function(pluginSecurityInfo){if(appSettings.set(cacheKey,(new Date).getTime()),pluginSecurityInfo.IsMBSupporter)return"";var infos=[getPremiereInfo];return browserInfo.safari&&AppInfo.isNativeApp||infos.push(getTheaterInfo),infos[getRandomInt(0,infos.length-1)]()}):(appSettings.set(cacheKey,(new Date).getTime()),Promise.resolve(""))}function getCard(img,target,shape){shape=shape||"backdropCard";var html='<div class="card scalableCard '+shape+" "+shape+'-scalable"><div class="cardBox"><div class="cardScalable"><div class="cardPadder cardPadder-backdrop"></div>';return html+=target?'<a class="cardContent" href="'+target+'" target="_blank">':'<div class="cardContent">',html+='<div class="cardImage lazy" data-src="'+img+'"></div>',html+=target?"</a>":"</div>",html+="</div></div></div>"}function getTheaterInfo(){var html="";html+="<div>",html+='<h1>Discover Emby Theater<button is="paper-icon-button-light" style="margin-left:1em;" onclick="this.parentNode.parentNode.remove();" class="autoSize"><i class="md-icon">close</i></button></h1>';var nameText=AppInfo.isNativeApp?"Emby Theater":'<a href="https://emby.media/download" target="_blank">Emby Theater</a>';return html+="<p>A beautiful app for your TV and large screen tablet. "+nameText+" runs on Windows, Xbox One, Raspberry Pi, Samsung Smart TVs, Sony PS4, Web Browsers, and more.</p>",html+='<div class="itemsContainer vertical-wrap">',html+=getCard("https://raw.githubusercontent.com/MediaBrowser/Emby.Resources/master/apps/theater1.png","https://emby.media/download"),html+=getCard("https://raw.githubusercontent.com/MediaBrowser/Emby.Resources/master/apps/theater2.png","https://emby.media/download"),html+=getCard("https://raw.githubusercontent.com/MediaBrowser/Emby.Resources/master/apps/theater3.png","https://emby.media/download"),html+="</div>",html+="<br/>",html+="</div>"}function getPremiereInfo(){var html="";html+="<div>",html+='<h1>Discover Emby Premiere<button is="paper-icon-button-light" style="margin-left:1em;" onclick="this.parentNode.parentNode.remove();" class="autoSize"><i class="md-icon">close</i></button></h1>';var cardTarget=AppInfo.isNativeApp?"":"https://emby.media/premiere",learnMoreText=AppInfo.isNativeApp?"":'<a href="https://emby.media/premiere" target="_blank">Learn more</a>';return html+="<p>Design beautiful Cover Art, enjoy free access to Emby apps, and more. "+learnMoreText+"</p>",html+='<div class="itemsContainer vertical-wrap">',html+=getCard("https://raw.githubusercontent.com/MediaBrowser/Emby.Resources/master/apps/theater1.png",cardTarget),html+=getCard("https://raw.githubusercontent.com/MediaBrowser/Emby.Resources/master/apps/theater2.png",cardTarget),html+=getCard("https://raw.githubusercontent.com/MediaBrowser/Emby.Resources/master/apps/theater3.png",cardTarget),html+="</div>",html+="<br/>",html+="</div>"}function renderLatestSection(elem,user,parent){var options={Limit:12,Fields:"PrimaryImageAspectRatio,BasicSyncInfo",ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Thumb",ParentId:parent.Id};return ApiClient.getJSON(ApiClient.getUrl("Users/"+user.Id+"/Items/Latest",options)).then(function(items){var html="",scrollX=enableScrollX();if(items.length){html+="<div>",html+='<h1 style="display:inline-block; vertical-align:middle;" class="listHeader">'+Globalize.translate("LatestFromLibrary",parent.Name)+"</h1>",html+='<a href="'+libraryBrowser.getHref(parent)+'" class="clearLink" style="margin-left:2em;"><button is="emby-button" type="button" class="raised more mini"><span>'+Globalize.translate("ButtonMore")+"</span></button></a>",html+="</div>",html+=scrollX?'<div is="emby-itemscontainer" class="hiddenScrollX itemsContainer">':'<div is="emby-itemscontainer" class="itemsContainer vertical-wrap">';var viewType=parent.CollectionType,shape="movies"===viewType?getPortraitShape():"music"===viewType?getSquareShape():getThumbShape(),supportsImageAnalysis=appHost.supports("imageanalysis");supportsImageAnalysis=!1;var cardLayout=supportsImageAnalysis&&("music"===viewType||"movies"===viewType||"tvshows"===viewType||"musicvideos"===viewType||!viewType);html+=cardBuilder.getCardsHtml({items:items,shape:shape,preferThumb:"movies"!==viewType&&"music"!==viewType,showUnplayedIndicator:!1,showChildCountIndicator:!0,context:"home",overlayText:!1,centerText:!cardLayout,overlayPlayButton:"photos"!==viewType,allowBottomPadding:!enableScrollX()&&!cardLayout,cardLayout:cardLayout,showTitle:"music"===viewType||!viewType||cardLayout,showYear:cardLayout&&"movies"===viewType,showSeriesYear:cardLayout&&"tvshows"===viewType,showParentTitle:"music"===viewType||!viewType||cardLayout&&"tvshows"===viewType,vibrant:supportsImageAnalysis&&cardLayout,lines:2}),html+="</div>"}elem.innerHTML=html,imageLoader.lazyChildren(elem)})}function loadRecentlyAdded(elem,user){return elem.classList.remove("homePageSection"),getUserViews(user.Id).then(function(items){for(var excludeViewTypes=["playlists","livetv","boxsets","channels"],excludeItemTypes=["Channel"],i=0,length=items.length;i<length;i++){var item=items[i];if(user.Configuration.LatestItemsExcludes.indexOf(item.Id)===-1&&excludeViewTypes.indexOf(item.CollectionType||[])===-1&&excludeItemTypes.indexOf(item.Type)===-1){var frag=document.createElement("div");frag.classList.add("homePageSection"),elem.appendChild(frag),renderLatestSection(frag,user,item)}}})}function loadLatestChannelMedia(elem,userId){var screenWidth=dom.getWindowSize().innerWidth,options={Limit:screenWidth>=2400?10:screenWidth>=1600?10:screenWidth>=1440?8:screenWidth>=800?7:6,Fields:"PrimaryImageAspectRatio,BasicSyncInfo",Filters:"IsUnplayed",UserId:userId};return ApiClient.getJSON(ApiClient.getUrl("Channels/Items/Latest",options)).then(function(result){var html="";result.Items.length&&(html+='<h1 class="listHeader">'+Globalize.translate("HeaderLatestChannelMedia")+"</h1>",html+='<div is="emby-itemscontainer" class="itemsContainer vertical-wrap">',html+=cardBuilder.getCardsHtml({items:result.Items,shape:"auto",showTitle:!0,centerText:!0,lazy:!0,showDetailsMenu:!0,overlayPlayButton:!0}),html+="</div>"),elem.innerHTML=html,imageLoader.lazyChildren(elem)})}function loadLibraryTiles(elem,user,shape){return getUserViews(user.Id).then(function(items){var html="";if(html+="<div>",items.length){html+="<div>",html+='<h1 class="listHeader">'+Globalize.translate("HeaderMyMedia")+"</h1>",html+="</div>";var scrollX=enableScrollX();html+=scrollX?'<div is="emby-itemscontainer" class="hiddenScrollX itemsContainer">':'<div is="emby-itemscontainer" class="itemsContainer vertical-wrap">',html+=cardBuilder.getCardsHtml({items:items,shape:scrollX?"overflowSmallBackdrop":shape,showTitle:!0,centerText:!0,overlayText:!1,lazy:!0,transition:!1,allowBottomPadding:!scrollX}),html+="</div>"}return html+="</div>",getAppInfo().then(function(infoHtml){elem.innerHTML=html+infoHtml,imageLoader.lazyChildren(elem)})})}function loadResumeVideo(elem,userId){var limit,screenWidth=dom.getWindowSize().innerWidth;enableScrollX()?limit=12:(limit=screenWidth>=1920?8:screenWidth>=1600?8:screenWidth>=1200?9:6,limit=Math.min(limit,5));var options={SortBy:"DatePlayed",SortOrder:"Descending",Filters:"IsResumable",Limit:limit,Recursive:!0,Fields:"PrimaryImageAspectRatio,BasicSyncInfo",CollapseBoxSetItems:!1,ExcludeLocationTypes:"Virtual",ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Thumb",EnableTotalRecordCount:!1,MediaTypes:"Video"};return ApiClient.getItems(userId,options).then(function(result){var html="";if(result.Items.length){html+='<h1 class="listHeader">'+Globalize.translate("HeaderContinueWatching")+"</h1>",html+=enableScrollX()?'<div is="emby-itemscontainer" class="hiddenScrollX itemsContainer">':'<div is="emby-itemscontainer" class="itemsContainer vertical-wrap">';var supportsImageAnalysis=appHost.supports("imageanalysis");supportsImageAnalysis=!1;var cardLayout=supportsImageAnalysis;html+=cardBuilder.getCardsHtml({items:result.Items,preferThumb:!0,shape:getThumbShape(),overlayText:!1,showTitle:!0,showParentTitle:!0,lazy:!0,showDetailsMenu:!0,overlayPlayButton:!0,context:"home",centerText:!cardLayout,allowBottomPadding:!1,cardLayout:cardLayout,showYear:!0,lines:2,vibrant:cardLayout&&supportsImageAnalysis}),html+="</div>"}elem.innerHTML=html,imageLoader.lazyChildren(elem)})}function loadResumeAudio(elem,userId){var limit,screenWidth=dom.getWindowSize().innerWidth;enableScrollX()?limit=12:(limit=screenWidth>=1920?8:screenWidth>=1600?8:screenWidth>=1200?9:6,limit=Math.min(limit,5));var options={SortBy:"DatePlayed",SortOrder:"Descending",Filters:"IsResumable",Limit:limit,Recursive:!0,Fields:"PrimaryImageAspectRatio,BasicSyncInfo",CollapseBoxSetItems:!1,ExcludeLocationTypes:"Virtual",ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Thumb",EnableTotalRecordCount:!1,MediaTypes:"Audio"};return ApiClient.getItems(userId,options).then(function(result){var html="";if(result.Items.length){html+='<h1 class="listHeader">'+Globalize.translate("HeaderContinueListening")+"</h1>",html+=enableScrollX()?'<div is="emby-itemscontainer" class="hiddenScrollX itemsContainer">':'<div is="emby-itemscontainer" class="itemsContainer vertical-wrap">';var cardLayout=!1;html+=cardBuilder.getCardsHtml({items:result.Items,preferThumb:!0,shape:getThumbShape(),overlayText:!1,showTitle:!0,showParentTitle:!0,lazy:!0,showDetailsMenu:!0,overlayPlayButton:!0,context:"home",centerText:!cardLayout,allowBottomPadding:!1,cardLayout:cardLayout,showYear:!0,lines:2}),html+="</div>"}elem.innerHTML=html,imageLoader.lazyChildren(elem)})}function loadNextUp(elem,userId){var query={Limit:enableScrollX()?24:15,Fields:"PrimaryImageAspectRatio,SeriesInfo,DateCreated,BasicSyncInfo",UserId:userId,ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Banner,Thumb"};ApiClient.getNextUpEpisodes(query).then(function(result){var html="";if(result.Items.length){html+="<div>",html+='<h1 style="display:inline-block; vertical-align:middle;" class="listHeader">'+Globalize.translate("HeaderNextUp")+"</h1>",html+='<a href="secondaryitems.html?type=nextup" class="clearLink" style="margin-left:2em;"><button is="emby-button" type="button" class="raised more mini"><span>'+Globalize.translate("ButtonMore")+"</span></button></a>",html+="</div>",html+=enableScrollX()?'<div is="emby-itemscontainer" class="hiddenScrollX itemsContainer">':'<div is="emby-itemscontainer" class="itemsContainer vertical-wrap">';var supportsImageAnalysis=appHost.supports("imageanalysis");supportsImageAnalysis=!1,html+=cardBuilder.getCardsHtml({items:result.Items,preferThumb:!0,shape:getThumbShape(),overlayText:!1,showTitle:!0,showParentTitle:!0,lazy:!0,overlayPlayButton:!0,context:"home",centerText:!supportsImageAnalysis,allowBottomPadding:!enableScrollX(),cardLayout:supportsImageAnalysis,vibrant:supportsImageAnalysis}),html+="</div>"}elem.innerHTML=html,imageLoader.lazyChildren(elem)})}function loadLatestChannelItems(elem,userId,options){return options=Object.assign(options||{},{UserId:userId,SupportsLatestItems:!0}),ApiClient.getJSON(ApiClient.getUrl("Channels",options)).then(function(result){var channels=result.Items,channelsHtml=channels.map(function(c){return'<div id="channel'+c.Id+'"></div>'}).join("");elem.innerHTML=channelsHtml;for(var i=0,length=channels.length;i<length;i++){var channel=channels[i];loadLatestChannelItemsFromChannel(elem,channel,i)}})}function loadLatestChannelItemsFromChannel(page,channel,index){var screenWidth=dom.getWindowSize().innerWidth,options={Limit:screenWidth>=1600?10:screenWidth>=1440?5:6,Fields:"PrimaryImageAspectRatio,BasicSyncInfo",Filters:"IsUnplayed",UserId:Dashboard.getCurrentUserId(),ChannelIds:channel.Id};ApiClient.getJSON(ApiClient.getUrl("Channels/Items/Latest",options)).then(function(result){var html="";if(result.Items.length){html+='<div class="homePageSection">',html+="<div>";var text=Globalize.translate("HeaderLatestFromChannel").replace("{0}",channel.Name);html+='<h1 style="display:inline-block; vertical-align:middle;" class="listHeader">'+text+"</h1>",html+='<a href="channelitems.html?id='+channel.Id+'" class="clearLink" style="margin-left:2em;"><button is="emby-button" type="button" class="raised more mini"><span>'+Globalize.translate("ButtonMore")+"</span></button></a>",html+="</div>",html+='<div is="emby-itemscontainer" is="emby-itemscontainer" class="itemsContainer vertical-wrap">',html+=cardBuilder.getCardsHtml({items:result.Items,shape:"autohome",defaultShape:"square",showTitle:!0,centerText:!0,lazy:!0,showDetailsMenu:!0,overlayPlayButton:!0}),html+="</div>",html+="</div>"}var elem=page.querySelector("#channel"+channel.Id);elem.innerHTML=html,imageLoader.lazyChildren(elem)})}function loadLatestLiveTvRecordings(elem,userId){return ApiClient.getLiveTvRecordings({userId:userId,limit:5,Fields:"PrimaryImageAspectRatio,BasicSyncInfo",IsInProgress:!1,EnableTotalRecordCount:!1,IsLibraryItem:!1}).then(function(result){var html="";result.Items.length&&(html+="<div>",html+='<h1 style="display:inline-block; vertical-align:middle;" class="listHeader">'+Globalize.translate("HeaderLatestTvRecordings")+"</h1>",html+='<a href="livetv.html?tab=3" onclick="LibraryBrowser.showTab(\'livetv.html\',3);" class="clearLink" style="margin-left:2em;"><button is="emby-button" type="button" class="raised more mini"><span>'+Globalize.translate("ButtonMore")+"</span></button></a>",html+="</div>"),html+=enableScrollX()?'<div is="emby-itemscontainer" class="hiddenScrollX itemsContainer">':'<div is="emby-itemscontainer" class="itemsContainer vertical-wrap">',html+=cardBuilder.getCardsHtml({items:result.Items,shape:enableScrollX()?"autooverflow":"auto",showTitle:!0,showParentTitle:!0,coverImage:!0,lazy:!0,showDetailsMenu:!0,centerText:!0,overlayText:!1,overlayPlayButton:!0,allowBottomPadding:!enableScrollX(),preferThumb:!0,cardLayout:!1}),html+="</div>",elem.innerHTML=html,imageLoader.lazyChildren(elem)})}return window.Sections={loadRecentlyAdded:loadRecentlyAdded,loadLatestChannelMedia:loadLatestChannelMedia,loadLibraryTiles:loadLibraryTiles,loadResumeVideo:loadResumeVideo,loadResumeAudio:loadResumeAudio,loadNextUp:loadNextUp,loadLatestChannelItems:loadLatestChannelItems,loadLatestLiveTvRecordings:loadLatestLiveTvRecordings,loadlibraryButtons:loadlibraryButtons},window.Sections});