importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js');
var config = {
    'messagingSenderId': '941070635934',
    'serverUrl':'https://rtm.imiconnect.io',
    'appid':'BE30094518' 
};/*importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js');

var config = {
    'messagingSenderId': "436980621943",
    'serverUrl':"https://devrtm.imiconnect.com",
    'appid':"SR24124021"
};*/
firebase.initializeApp(config);
var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('payload  ', payload);
    var dataObj = payload.data ||{};
    var title = dataObj.title || "";
    var body = dataObj.alert || "";  
    var extras={};
    if(dataObj.extras){
        extras=JSON.parse(dataObj.extras);
    }
    var icon = extras.iconurl;
    var tag = payload.collapse_key || dataObj.tid;
    var pushextras = {};
    var appId = dataObj.appId;
    pushextras.appId = appId;
    pushextras.tid = dataObj.tid;
    pushextras.url = extras.url;
    var notificationOptions = {
        body: body,
        icon: icon,
        tag: tag,
        requireInteration: true,
        data: pushextras
    };
    var trackDeliveryURL = config.serverUrl + '/rtmsAPI/api/v1/' + config.appid + '/trackDeliveryRequest' +
            '?tid=' + dataObj.tid + '&appId=' + config.appid;

    
    //sendig DR
    fetch(trackDeliveryURL).
            catch (function (err) {
                console.log(err);
            });
    //showing local notification
    return  self.registration.showNotification(title,
            notificationOptions)



});

self.addEventListener('notificationclick', function (event) {
    var clickReadDeliveryURL = config.serverUrl + '/rtmsAPI/api/v1/' + config.appid + '/trackReadRequest' +
            '?appId='+config.appid;
    
    if (event.notification.data && event.notification.data.tid) {
        clickReadDeliveryURL += '&tid=' + event.notification.data.tid;
    }

    //sending read
    fetch(clickReadDeliveryURL).
            catch (function (err) {
                console.log(err);
            });


    event.notification.close();

    function notificationURL() {
        var url = event.notification.data && event.notification.data.url ? event.notification.data.url : "",
                url,
                queryString;       
        if (url.indexOf('?') > -1) {
            queryString = url.substring(url.indexOf('?'));
            url = decodeURIComponent(queryString.split('=')[1]);
        }
        console.log(url);
        return url;
    }


    // focuses if it is
    event.waitUntil(
            clients.matchAll({
                type: "window"
            })
            .then(function (clientList) {
                var url = notificationURL();              
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    if (url !== "" && url !== undefined && url !== "undefined") {
                        return clients.openWindow(url);
                    }

                }
            })
            );
});

